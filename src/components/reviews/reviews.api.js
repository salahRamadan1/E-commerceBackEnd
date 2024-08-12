import express from "express";
import { allowed, protectedRoutes } from "../users/auth.js";
import { createReview, deleteReview, getOneRview, getRview, updateReview } from "./review.service.js";
const routerReview = express.Router();

routerReview
    .route("/")
    .post(protectedRoutes, allowed('user'), createReview)
    .delete(protectedRoutes, allowed('user', 'admin'), deleteReview)
    .patch(protectedRoutes, allowed('user'), updateReview)
    // .get(getRview)


routerReview.get('/:id' , getRview)


export { routerReview };
