import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";

function StudentLibrary() {
  const [documents, setDocuments] = useState([]);
  const [purchasedDocuments, setPurchasedDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const paymentFailedRef = useRef(false);

  // =============================
  // Fetch Documents
  // =============================

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const [documentsResponse, purchasesResponse] = await Promise.all([
        api.get("/documents"),
        api.get("/purchases/my-purchases"),
      ]);

      setDocuments(documentsResponse.data.data || []);
      setPurchasedDocuments(purchasesResponse.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch library data:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Unable to load library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =============================
  // Check Purchase
  // =============================

  const isPurchased = (documentId) => {
    return purchasedDocuments.some(
      (purchase) =>
        purchase.document_id === documentId && purchase.status === "paid",
    );
  };

  // =============================
  // Subjects
  // =============================

  const subjects = useMemo(() => {
    const uniqueSubjects = documents
      .map((document) => document.subject)
      .filter(Boolean);

    return ["all", ...new Set(uniqueSubjects)];
  }, [documents]);

  // =============================
  // Filter Documents
  // =============================

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        document.title?.toLowerCase().includes(searchText) ||
        document.description?.toLowerCase().includes(searchText);

      const matchesSubject = subject === "all" || document.subject === subject;

      return matchesSearch && matchesSubject;
    });
  }, [documents, search, subject]);

  // =============================
  // Purchase
  // =============================

  const handlePurchase = async (documentId) => {
    try {
      setProcessingPayment(true);
      setError("");
      setPaymentStatus("");
      setPaymentMessage("");

      paymentFailedRef.current = false;

      // Create Razorpay Order
      const response = await api.post("/payments/create-order", {
        document_id: documentId,
      });

      const order = response.data.data;

      if (!order?.order_id) {
        throw new Error("Payment order was not created.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout is not loaded.");
      }

      // Razorpay Options
      const options = {
        key: order.razorpay_key,
        amount: order.amount,
        currency: order.currency,

        name: "Student Management",

        description: order.document_title,

        order_id: order.order_id,

        // =============================
        // Payment Success
        // =============================

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              razorpay_order_id: paymentResponse.razorpay_order_id,

              razorpay_payment_id: paymentResponse.razorpay_payment_id,

              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              await fetchDocuments();

              setPaymentStatus("success");

              setPaymentMessage(
                "Payment successful! Your document has been purchased successfully.",
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error.response?.data || error.message,
            );

            setError(
              error.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setProcessingPayment(false);
          }
        },

        // =============================
        // Payment Cancelled
        // =============================

        modal: {
          ondismiss: async function () {
            if (paymentFailedRef.current) {
              return;
            }

            try {
              await api.post("/payments/failed", {
                razorpay_order_id: order.order_id,
                failure_reason: "Payment cancelled by user",
              });

              setPaymentStatus("failed");

              setPaymentMessage("Payment cancelled. No amount was charged.");
            } catch (error) {
              console.error(
                "Failed to update cancelled payment:",
                error.response?.data || error.message,
              );

              setPaymentStatus("failed");

              setPaymentMessage("Payment was cancelled.");
            } finally {
              setProcessingPayment(false);
            }
          },
        },

        theme: {
          color: "#000000",
        },
      };

      // Create Razorpay instance
      const razorpay = new window.Razorpay(options);

      // =============================
      // Payment Failed
      // =============================

      razorpay.on("payment.failed", async function (response) {
        console.error("Payment failed:", response);

        paymentFailedRef.current = true;

        const failureReason =
          response.error?.description ||
          response.error?.reason ||
          response.error?.code ||
          "Payment failed";

        try {
          await api.post("/payments/failed", {
            razorpay_order_id: response.error?.metadata?.order_id,

            razorpay_payment_id: response.error?.metadata?.payment_id,

            failure_reason: failureReason,
          });
        } catch (error) {
          console.error(
            "Failed to update payment:",
            error.response?.data || error.message,
          );
        }

        setPaymentStatus("failed");

        setPaymentMessage(failureReason);

        setProcessingPayment(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment.",
      );

      setProcessingPayment(false);
    }
  };

  // =============================
  // Loading
  // =============================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Library</h1>

        <p className="mt-4 text-sm text-gray-500">Loading documents...</p>
      </div>
    );
  }

  // =============================
  // Error
  // =============================

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Library</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchDocuments}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Student Library
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Browse and purchase study documents.
        </p>
      </div>

      {/* Payment Status */}
      {paymentStatus && (
        <div
          className={`mb-6 rounded-xl border p-4 ${
            paymentStatus === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-xl">
              {paymentStatus === "success" ? "✅" : "❌"}
            </div>

            <div>
              <h3
                className={`font-semibold ${
                  paymentStatus === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {paymentStatus === "success"
                  ? "Payment Successful"
                  : "Payment Failed"}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  paymentStatus === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {paymentMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        {/* Search */}
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 md:flex-1"
        />

        {/* Subject */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-500"
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All Subjects" : item}
            </option>
          ))}
        </select>
      </div>

      {/* Result Count */}
      <div className="mb-4 text-sm text-gray-500">
        {filteredDocuments.length} document
        {filteredDocuments.length !== 1 ? "s" : ""} found
      </div>

      {/* Documents */}
      {filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">📚</div>

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            No documents found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try another search or subject.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Badge */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {document.subject || "General"}
                </span>

                {isPurchased(document.id) ? (
                  <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Purchased
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">#{document.id}</span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-900">
                {document.title}
              </h2>

              {/* Description */}
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                {document.description || "No description available."}
              </p>

              {/* Price + Action */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400">Price</p>

                  <p className="text-lg font-semibold text-gray-900">
                    ₹{document.price}
                  </p>
                </div>

                {isPurchased(document.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/student/library/${document.id}`;
                    }}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    View Document
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePurchase(document.id)}
                    disabled={processingPayment}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processingPayment ? "Processing..." : "Purchase"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentLibrary;
