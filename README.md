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

## OpenAI 買家

先在兩個終端分別啟動 `npm run api` 與 `npm run dev`。到「模擬控制台」貼上 API Key 後，系統會在每個模擬日用 `gpt-5-mini` 扮演五位買家，依預算、品類偏好、價格和評價決定是否購買，並為成交商品留下短評。

Key 僅透過本機 `localhost` 傳給 API 程序並保留在記憶體；不會寫入檔案、Git 或瀏覽器儲存空間，重啟 `npm run api` 後即清除。也可在啟動前以 `OPENAI_API_KEY` 環境變數設定；要改用其他可用模型，設定 `OPENAI_MODEL`（預設為 `gpt-5-mini`）。未設定 Key 時，會維持原本的規則式買家模擬。
