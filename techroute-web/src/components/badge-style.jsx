const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-[#EBEAFD] text-[#6E6BF0]";
    case "REVIEWING":
      return "bg-[#FCF1DC] text-[#C9820A]";
    case "INTERVIEW":
      return "bg-[#E0F2FE] text-[#0284C7]";
    case "ACCEPTED":
      return "bg-[#E4F7EF] text-[#1C9A6C]";
    case "REJECTED":
      return "bg-[#FCE7EB] text-[#D6455D]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default getStatusBadgeStyle;
