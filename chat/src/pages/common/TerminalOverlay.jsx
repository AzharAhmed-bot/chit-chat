const TerminalOverlay = () => {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="relative bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded-lg p-3 overflow-hidden font-mono">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-2 border-b border-border pb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-xs text-primary">ENCRYPTION ACTIVE</p>
            </div>
            <p className="text-xs text-muted-foreground">Session ID: 9381.VCTR.22</p>
          </div>
  
          <p className="text-sm text-foreground mb-2 tracking-tight">
            <span className="text-primary">/</span> ENCRYPTION PROTOCOL
          </p>
  
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-start">
              <div className="text-primary mr-2">01</div>
              <span>
                Quantum-resistant vector encryption enabled for all messages.
              </span>
            </div>
            <div className="flex items-start">
              <div className="text-primary mr-2">02</div>
              <span>
                GNFS bypassed – no classical or quantum factorization detected.
              </span>
            </div>
            <div className="flex items-start">
              <div className="text-primary mr-2">03</div>
              <span>
                End-to-end chat encryption with real-time integrity checks.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default TerminalOverlay;
  