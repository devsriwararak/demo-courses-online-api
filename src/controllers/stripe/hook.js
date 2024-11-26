
import Stripe from "stripe";
import pool from "../../db/index.js";

import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export const stripeHookCheck = async(req,res)=> {
    console.log("Stripe Signature:", req.headers["stripe-signature"]);

    const signature = req.headers["stripe-signature"];
    let event;
    const db = await pool.connect();

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const paymentData = event.data.object;
        const sessionId = paymentData.id;
        const status = paymentData.status === "complete" ? 1 : 0;

        try {
          const sql = `UPDATE pay SET status = $1 WHERE session_id = $2`;
          await db.query(sql, [status, sessionId]);
          console.log('update order success !');
          
        } catch (error) {
          console.log("INSERT SQL ERROR : ", error);
        } finally {
          db.release();
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Received");
}