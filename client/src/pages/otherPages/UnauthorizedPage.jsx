import sadStudent from "../../assets/images/sad-student.jpg";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center w-dvw h-dvh bg-blue-50">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-12 max-w-5xl w-full">

        {/* Left side */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 flex-1">
          <h1 className="text-8xl font-extrabold text-blue-900 drop-shadow-sm">
            401
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600">
            Unauthorized Access
          </h2>
          <p className="text-blue-700 text-base md:text-lg max-w-md">
            You don't have permission to view this page.  
            Please log in or contact your administrator for access.
          </p>
          <button
            className="mt-4 px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md border-2 border-blue-900 transition-all duration-300 hover:bg-blue-700 hover:scale-105"
            onClick={() => (window.location.href = "/")}
          >
            Go Back to Dashboard
          </button>
        </div>

        {/* Right side */}
        <div className="flex justify-center flex-1">
          <img
            src={sadStudent}
            alt="Unauthorized Illustration"
            className="w-64 md:w-125 object-contain drop-shadow-xl mr-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
