# API doc for EcoCart

---

`/calculate-total-co`

## body params

```json
{
  "product_titles": []
}
```

## response

side note, it's in grams

```json
{
  "total_co": 42123
}
```

---

`/generate-product-co-message`

## body params

```json
{
  "categories": [],
  "product_title": ""
}
```


## response

```json
{
  "completion_content": ""
}
```
