import React from 'react';
export class ErrorBoundary extends React.Component {
 constructor(props){super(props);this.state={hasError:false};}
 static getDerivedStateFromError(){return {hasError:true};}
 componentDidCatch(error,info){console.error('MATRA render error',error,info);}
 render(){if(!this.state.hasError)return this.props.children;return <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-2xl font-semibold text-primary">M</div><h1 className="text-2xl font-semibold text-ink">Halaman tidak dapat ditampilkan</h1><p className="mt-4 text-sm leading-relaxed text-muted">Terjadi kesalahan pada tampilan. Coba muat ulang halaman atau kembali ke beranda.</p><div className="mt-7 flex flex-wrap items-center justify-center gap-3"><button onClick={()=>window.location.reload()} className="btn-primary">Muat ulang</button><a href="/" className="btn-outline">Kembali ke beranda</a></div></main>;}
}
