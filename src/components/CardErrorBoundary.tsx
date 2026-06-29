import { Component, type ReactNode } from 'react';

interface Props {
  cardId: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class CardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-400/50 rounded-[20px] p-4 text-[12px] text-red-600 dark:text-red-400 flex flex-col gap-1.5">
          <span className="font-bold text-red-500">Card Error</span>
          <span className="opacity-70 font-mono text-[11px] leading-relaxed break-all">{this.state.errorMessage}</span>
        </div>
      );
    }
    return this.props.children;
  }
}