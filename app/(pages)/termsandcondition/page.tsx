import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | BlazeCab",
  description:
    "Read BlazeCab's terms and conditions for cab rentals: booking, pricing, cancellations, refunds, liabilities, and user responsibilities.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 mt-10 sm:mt-0">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-sm text-gray-500">Last updated: 23 Aug 2025</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#6aa4e0]">
            Terms & Conditions
          </h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            Welcome to <span className="font-semibold">BlazeCab</span>. By
            accessing or using our cab rental services, you agree to these Terms
            & Conditions. Please read them carefully before making any bookings.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* 1. General */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">1. General</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              BlazeCab provides cab rental services across India via our
              website, mobile app, and customer support.
            </li>
            <li>
              By using our services you agree to these Terms, our Privacy
              Policy, and any service-specific rules communicated to you.
            </li>
            <li>
              We may update these Terms at any time. Continued use after changes
              constitutes acceptance of the updated Terms.
            </li>
          </ul>
        </article>

        {/* 2. Booking & Confirmation */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            2. Booking & Confirmation
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Bookings must be made through our official channels. A booking is
              confirmed only after you receive a BlazeCab confirmation
              (SMS/Email/App).
            </li>
            <li>
              Provide accurate pickup location, date/time, trip type, and
              passenger details. Incorrect details may lead to delays or
              cancellation.
            </li>
            <li>
              We may verify your phone number and require valid ID at the time
              of pickup.
            </li>
          </ul>
        </article>

        {/* 3. Pricing & Payment */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            3. Pricing & Payment
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              Fares are shown before checkout and are inclusive of applicable
              taxes.
            </li>
            <li>
              Packages may include a base km/hour limit.{" "}
              <span className="font-medium">Extra km/hour</span> beyond the
              limit will be charged per our current rate card.
            </li>
            <li>
              Tolls, interstate permits, parking, and entry fees are usually{" "}
              <span className="font-medium">extra</span> unless explicitly
              mentioned.
            </li>
            <li>
              Payments can be made online (UPI/cards/wallets) or cash where
              allowed.
            </li>
            <li>
              Dynamic pricing may apply during peak hours, holidays, or high
              demand.
            </li>
          </ul>
        </article>

        {/* 4. Cancellation & Refunds */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            4. Cancellation & Refunds
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <span className="font-medium">Full refund if cancelled before 4 hours of the ride. Only minimal getaway charges (if any) will apply</span>
            </li>
            <li>
              <span className="font-medium">No refund if cancelled within 4 hours of the ride.</span>{" "}
            </li>
            <li>
              <span className="font-medium">Refunds are processed to the original payment method within 3–5 business days.</span> 
            </li>
            
          </ul>
        </article>

        {/* 5. User Responsibilities */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            5. User Responsibilities
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Carry a valid ID for outstation and certain city rides.</li>
            <li>
              Keep personal belongings safe; BlazeCab is not liable for items
              left in vehicles. Contact support promptly for lost & found.
            </li>
            <li>
              Smoking, consumption of alcohol, or illegal substances inside the
              cab is prohibited.
            </li>
            <li>
              Any damage to the vehicle due to passenger negligence will be
              chargeable.
            </li>
            <li>
              Treat drivers respectfully; abusive behavior may lead to
              termination of the trip.
            </li>
          </ul>
        </article>

        {/* 6. Driver & Vehicle Policy */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            6. Driver & Vehicle Policy
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>All drivers are licensed and background-verified.</li>
            <li>
              Vehicles are periodically inspected and maintained for safety.
            </li>
            <li>
              In unavoidable circumstances, BlazeCab may change the assigned
              vehicle or driver while ensuring similar class/service.
            </li>
            <li>
              For outstation trips, driver allowances (DA) may apply as per the
              package.
            </li>
          </ul>
        </article>

        {/* 7. Delays, Route & Waiting */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            7. Delays, Route & Waiting
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              BlazeCab is not responsible for delays caused by traffic, weather,
              civic restrictions, or events beyond our control.
            </li>
            <li>
              Routes are decided by the driver using the safest/fastest option
              unless a specific route is requested and agreed.
            </li>
            <li>
              Complimentary waiting up to 20 minutes at pickup; further waiting
              may be chargeable as per rate card.
            </li>
          </ul>
        </article>

        {/* 8. Safety */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">8. Safety</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Seatbelts are mandatory for all passengers where available.</li>
            <li>
              Children must use appropriate child seats provided by the user.
            </li>
            <li>
              Do not request drivers to exceed speed limits or violate road
              regulations.
            </li>
          </ul>
        </article>

        {/* 9. Limitation of Liability */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            9. Limitation of Liability
          </h2>
          <p className="mt-3 text-gray-700">
            To the maximum extent permitted by law, BlazeCab shall not be liable
            for any indirect, incidental, special, punitive, or consequential
            damages, or for loss of profits, data, goodwill, or other intangible
            losses arising from your use of the services.
          </p>
        </article>

        {/* 10. Privacy */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">10. Privacy</h2>
          <p className="mt-3 text-gray-700">
            We collect and process personal data in accordance with our Privacy
            Policy, including contact information, trip details, and payment
            data necessary to deliver our services and prevent fraud.
          </p>
        </article>

        {/* 11. Governing Law & Disputes */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            11. Governing Law & Disputes
          </h2>
          <p className="mt-3 text-gray-700">
            These Terms are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts in your booking
            city or New Delhi (as applicable).
          </p>
        </article>

        {/* 12. Contact */}
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            12. Contact Us
          </h2>
          <div className="mt-4 grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
            <div>
              <p className="text-gray-700">
                For questions or concerns regarding these Terms, contact:
              </p>
              <ul className="mt-2 space-y-1 w-full ">
                <li className="flex gap-1 items-center">
                  <MdMail /> info@blazecab.com
                </li>
                <li className="flex gap-1 items-center">
                  <FaPhoneAlt /> 7703821374
                </li>
                <li className="flex gap-1 items-start">
                  <FaMapMarkerAlt className="flex-shrink-0" /> A194 3rd Floor, A
                  Block, Block F, Sudershan Park, New Delhi, Delhi, 110015,
                  India
                </li>
              </ul>
            </div>
            <div className="flex items-center sm:justify-end">
              <Link
                href="/contactus"
                
              >
                <Button>Need help? Contact Us</Button>
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
