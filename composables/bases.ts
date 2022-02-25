let bases = useState<number[]>('bases', () => []);
bases.value = [1, 2, 3];
export const refreshBases = () => useAsyncData('bases', () => $fetch('/api/bases'));
console.log("### bases exists");