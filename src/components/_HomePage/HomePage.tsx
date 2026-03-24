
import UserSideProductsPage from '../../app/(user)/product/page'
import FrontTeser from '../home/FrontTeser'
import HeroBannerCarousel from '../home/HeroBannerCarosoul'
// import CreateProduct from '../_Products/CreateProducts'

export default function HomePage() {

  return (
    <div >

      <div className='lg:mt-[75px] mt-[65px] lg:mb-6 mb-3'>
        <HeroBannerCarousel></HeroBannerCarousel>
      </div>
      
     <div >
        
      <UserSideProductsPage></UserSideProductsPage>
   
     </div>

     <div>
      <FrontTeser></FrontTeser>
     </div>
    
    </div>
  )
}
