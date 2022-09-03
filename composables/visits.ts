export const useRegisterVisit = async (
  objectType: string,
  instanceId: number
) => {
  await useApiGet(`visit/${objectType}/${instanceId}`, {})
}
