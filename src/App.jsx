import React,{useEffect} from 'react';
import {Navigate,Route,Routes,useLocation,useSearchParams} from 'react-router-dom';
import {useApp} from './context/AppContext';
import {PublicLayout,DashboardLayout} from './components/Layouts';
import {PublicHome,FacilityListPage,FacilityDetailPage,FacilityCalendarPage,SlotDetailPage,ConfirmationInfoPage,SearchLanding,SearchFiltersPage,TimeFilterPage,SearchResultsPage,SearchCalendarPage,ServicesPage,ServiceDetailPage,GuidePage} from './pages/PublicPages';
import {LoginHubPage,LoginPJPage,LoginAdminPage} from './pages/AuthPages';
import {PJPage} from './pages/PJPages';
import {AdminPage} from './pages/AdminPages';
import {EmptyState,Button} from './components/UI';
import LoadingIndicator from './components/LoadingIndicator';

function Protected({role,children}){const {role:current,data}=useApp();const {pathname}=useLocation();if(current!==role)return <Navigate to={{admin:'/login/admin',pj:'/login/pj'}[role]||'/login'} replace state={{from:pathname}}/>;if(role==='pj'&&!data.pjCodeActive&&pathname!=='/pj/kode-tidak-berlaku')return <Navigate to="/pj/kode-tidak-berlaku" replace/>;return children;}
function RedirectOldSlot(){const [params]=useSearchParams();return <Navigate to={'/ruang-kuliah/'+(params.get('facility')||'gds-607')+'#status-slot'} replace/>;}
function NotFound(){return <div className="main-wrap py-20"><EmptyState title="Halaman tidak ditemukan" description="Periksa kembali tautan atau kembali ke beranda MATRA." action={<Button to="/">Kembali ke beranda</Button>}/></div>}
export default function App(){return <><LoadingIndicator/><Routes>
 <Route element={<PublicLayout/>}>
  <Route index element={<PublicHome/>}/>
  <Route path="ruang-kuliah" element={<FacilityListPage type="room"/>}/>
  <Route path="ruang-kuliah/kalender" element={<FacilityCalendarPage type="room"/>}/>
  <Route path="ruang-kuliah/status-slot" element={<RedirectOldSlot/>}/>
  <Route path="ruang-kuliah/konfirmasi-pj" element={<Navigate to="/ruang-kuliah/gds-607#konfirmasi-pj" replace/>}/>
  <Route path="ruang-kuliah/:id" element={<FacilityDetailPage type="room"/>}/>
  <Route path="lab-komputer" element={<FacilityListPage type="lab"/>}/>
  <Route path="lab-komputer/software" element={<Navigate to="/lab-komputer/gds-507#perangkat-lunak" replace/>}/>
  <Route path="lab-komputer/kalender" element={<FacilityCalendarPage type="lab"/>}/>
  <Route path="lab-komputer/pemeriksaan" element={<Navigate to="/lab-komputer/gds-507#pemeriksaan" replace/>}/>
  <Route path="lab-komputer/:id" element={<FacilityDetailPage type="lab"/>}/>
  <Route path="cari" element={<SearchLanding/>}/>
  <Route path="cari/filter" element={<Navigate to="/cari" replace/>}/>
  <Route path="cari/waktu" element={<Navigate to="/cari" replace/>}/>
  <Route path="cari/hasil" element={<SearchResultsPage/>}/>
  <Route path="cari/kalender" element={<SearchCalendarPage/>}/>
  <Route path="layanan-kampus" element={<ServicesPage/>}/>
  <Route path="layanan-kampus/:id" element={<ServiceDetailPage/>}/>
  <Route path="login" element={<LoginHubPage/>}/>
  <Route path="login/publik" element={<Navigate to="/" replace/>}/>
  <Route path="login/mahasiswa" element={<Navigate to="/login" replace/>}/>
  <Route path="login/pj" element={<LoginPJPage/>}/>
  <Route path="login/admin" element={<LoginAdminPage/>}/>
  <Route path="masuk-pj" element={<Navigate to="/login/pj" replace/>}/>
  <Route path="login-admin" element={<Navigate to="/login/admin" replace/>}/>
  <Route path="mahasiswa" element={<Navigate to="/" replace/>}/>
  <Route path="petunjuk-peminjaman" element={<GuidePage/>}/>
  <Route path="*" element={<NotFound/>}/>
 </Route>
 <Route path="pj" element={<Protected role="pj"><DashboardLayout as="pj"/></Protected>}>
  <Route index element={<PJPage/>}/><Route path="pengajuan/:id" element={<PJPage/>}/><Route path="*" element={<PJPage/>}/>
 </Route>
 <Route path="admin" element={<Protected role="admin"><DashboardLayout as="admin"/></Protected>}>
  <Route index element={<AdminPage/>}/><Route path="*" element={<AdminPage/>}/>
 </Route>
 </Routes></>}
