import Sidebar from '../_components/Sidebar'
import CarRentalList from '../_components/CarRentalList'

const page = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <CarRentalList />
    </div>
  );
};

export default page