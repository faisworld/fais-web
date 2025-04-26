declare module 'probe-image-size' {
  interface ProbeResult {
    width: number;
    height: number;
    type?: string;
    mime?: string;
    [key: string]: any;
  }
  function probe(buffer: Buffer): Promise<ProbeResult>;
  namespace probe {
    function sync(buffer: Buffer): ProbeResult;
  }
  export = probe;
}
