# MarketPilot Simulator

## 賣家 Agent API

啟動 API：

```bash
npm run api
```

市場狀態暫存於伺服器記憶體；重啟 API 即會重置。前端仍可用 `npm run dev` 啟動。你的賣家 Agent 每一日依序讀取狀態、提交動作、推進模擬：

```bash
# 1. 讀取市場狀態與商品目錄
curl http://localhost:3001/api/state

# 2. 提交一或多個動作（伺服器會驗證）
curl -X POST http://localhost:3001/api/actions \
  -H 'Content-Type: application/json' \
  -d '{"actions":[{"type":"list_product","productId":"P002","price":799,"initial_inventory":100}]}'

# 3. 推進一天；已接受的動作會在此套用
curl -X POST http://localhost:3001/api/step \
  -H 'Content-Type: application/json' \
  -d '{"days":1}'
```

可用動作：`list_product`、`update_price`、`restock`、`delist_product`。每個動作必須含 `productId`；上架和改價另需 `price`（高於成本），上架需 `initial_inventory`，補貨需 `quantity`。

OpenAI 應由你的 Agent 伺服器讀取 `OPENAI_API_KEY` 後，再呼叫上述 API；不要將金鑰交給瀏覽器。可用 Responses API 的 function calling，將 `GET /api/state`、`POST /api/actions` 與 `POST /api/step` 定義成模型工具。
