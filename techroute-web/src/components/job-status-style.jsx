const getJobStatusStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "OPENING":
      return "bg-green-100 text-green-700";
    case "CLOSED":
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

export default getJobStatusStyle;
