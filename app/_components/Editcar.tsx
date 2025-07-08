"use client"

import { CarRentalSearch} from './CarRentalSearch'; // adjust path as needed
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type FormData = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: Date; // 👈 store as Date for correct binding
  dropoffDate: Date;
};

interface Props {
  pickupLocation: string;
  dropoffLocation?: string;
  rideType: string;
  formattedDate: string | null;
 initialValues?: Partial<FormData> & { rideType?: string };
}

const Editcar = ({
  pickupLocation,
  dropoffLocation,
  rideType,
  formattedDate,
  initialValues,
}: Props) => {
  const[showForm,setShowForm] = useState<boolean>(false)
  return (
    <>
     {showForm ? (
        <CarRentalSearch initialValues={initialValues} source="carride" setShowForm={setShowForm} showForm={showForm}/>
      ) : (
        <div className="bg-white shadow-md rounded-2xl px-6 py-5 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4  w-full">
            <div className={`grid grid-cols-2 ${rideType === "Local" ? "sm:grid-cols-3" : "sm:grid-cols-4"}  gap-x-8 gap-y-2 text-sm sm:text-base text-gray-800  w-full sm:w-1/2`}>
              <div>
                <p className="font-medium text-gray-500">Pickup</p>
                <p className="font-semibold">{pickupLocation}</p>
              </div>
              {
                dropoffLocation && <div>
              <p className="font-medium text-gray-500">{rideType == "Round Trip"? ("Destination"):("Dropoff") }</p>
                <p className="font-semibold">{dropoffLocation}</p>
                
              </div>
              }
              <div>
                <p className="font-medium text-gray-500">Date</p>
                <p className="font-semibold">
                  {formattedDate}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Ride Type</p>
                <p className="font-semibold">{rideType}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-1/5 h-10"
            >
              Edit
            </Button>
          </div>
        </div>
      )}

    </>
  );
};

export default Editcar;
