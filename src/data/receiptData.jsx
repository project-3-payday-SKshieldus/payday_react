const receiptData = [
    {
        receiptId: 1,
        storeName: "단토리",
        date: "2024/06/19 19:08",
        address: "서울 강서구 공항대로 247",
        items: [
            { receiptContentId: 1, name: "공깃밥", price: 3000, quantity: 3 },
            { receiptContentId: 2, name: "코크 하이볼", price: 3900, quantity: 1 },
            { receiptContentId: 3, name: "토마토 하이볼", price: 5900, quantity: 1 },
        ],
    },
    {
        receiptId: 2,
        storeName: "초밥천국",
        date: "2024/06/15 18:45",
        address: "서울 마포구 양화로 123",
        items: [
            { receiptContentId: 4, name: "초밥 세트", price: 15000, quantity: 2 },
            { receiptContentId: 5, name: "사케", price: 12000, quantity: 1 },
        ],
    },
    {
        receiptId: 3,
        storeName: "치킨마을",
        date: "2024/07/01 20:30",
        address: "서울 강남구 테헤란로 45",
        items: [
            { receiptContentId: 6, name: "치킨", price: 18000, quantity: 1 },
            { receiptContentId: 7, name: "맥주", price: 4000, quantity: 2 },
        ],
    },
];

export default receiptData;
