import express from "express"

const app = express()

app.use(express.json())

app.get("/teste", (req, res) => {
  res.json({ message: "API funcionando!" })
})

export default app