import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { token, user } = await authenticateUser(identifier, password);
    
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(401).json({ message: "Invalid username or password" });
  }
}
