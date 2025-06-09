def merge_expenses(event_expenses: list[dict], group_expense_expenses: list[dict]) -> list[dict]:
    group_map = {g["id"]: g for g in group_expense_expenses}
    merged = []
    for e in event_expenses:
        ext_id = e.get("external_doc_id")
        g = group_map.get(ext_id)
        if g:
            merged.append({
                "creator_id": e.get("creator_id"),
                "id": e.get("id"),
                "concept": g.get("concept"),
                "total": g.get("total"),
                "type": g.get("type"),
                "payer_id": g.get("payerId"),
            })
        else:
            pass
    return merged
