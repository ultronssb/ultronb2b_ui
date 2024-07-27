import B2BTabs from "../../common/B2BTabs"

const ProductHome = ({ tabsData = [] }) => {

   return (
    <B2BTabs tabsdData={tabsData} justify={"flex-start"} />
   )
}

export default ProductHome;