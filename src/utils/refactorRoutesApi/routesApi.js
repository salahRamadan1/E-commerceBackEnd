import { routerAddressList } from "../../components/address/address.api.js";
import { routerBrand } from "../../components/brands/brands.api.js";
import { routerCart } from "../../components/carts/cart.api.js";
import { routerCategory } from "../../components/category/category.api.js";
import { routerCoupon } from "../../components/coupon/coupon.api.js";
import { routerOrder } from "../../components/orders/order.api.js";
import { routerProduct } from "../../components/products/product.api.js";
import { routerReview } from "../../components/reviews/reviews.api.js";
import { routerSubCategory } from "../../components/subCategory/subCategory.api.js";
import { routerUserAuth } from "../../components/users/user.api.js";
import { routerWishList } from "../../components/wishList/wishList.api.js";

export const routes = (app) => {
    app.use("/category", routerCategory);
    app.use("/subCategory", routerSubCategory);
    app.use("/product", routerProduct);
    app.use("/user", routerUserAuth);
    app.use("/review", routerReview);
    app.use("/wishList", routerWishList);
    app.use("/address", routerAddressList);
    app.use("/coupon", routerCoupon);
    app.use("/cart", routerCart);
    app.use("/order", routerOrder);
    app.use("/brand", routerBrand);



}