const getDynamicStatus = (job) => {
  const targetDateStr = job.createdAt;
  if (!targetDateStr) return job.status;

  const today = new Date();
  const targetDate = new Date(targetDateStr);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= 2) return "Closing Soon";

  return job.status;
};

export default getDynamicStatus;
