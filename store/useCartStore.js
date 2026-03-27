import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // 장바구니 아이템 목록
      isDrawerOpen: false, // 장바구니 팝업 열림/닫힘 상태

      // 1. 상품 담기
      addItem: (product, optionId = null) => {
        set((state) => {
          // 이미 있는 상품인지 확인 (옵션이 다르면 다른 상품 취급)
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id && item.selectedOption === optionId
          );

          if (existingItemIndex > -1) {
            // 이미 있으면 수량만 +1
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems, isDrawerOpen: true }; // 담으면 자동으로 팝업 열기
          } else {
            // 없으면 새로 추가
            return {
              items: [
                ...state.items,
                {
                  ...product,
                  quantity: 1,
                  selectedOption: optionId, // 옵션 ID 저장
                },
              ],
              isDrawerOpen: true,
            };
          }
        });
      },

      // 2. 수량 변경 (+, -)
      updateQuantity: (productId, optionId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === productId && item.selectedOption === optionId) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty };
              }
              return item;
            })
            .filter((item) => item.quantity > 0), // 수량이 0이면 자동 삭제
        }));
      },

      // 3. 상품 삭제
      removeItem: (productId, optionId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === productId && item.selectedOption === optionId)
          ),
        }));
      },

      // 4. 장바구니 비우기
      clearCart: () => set({ items: [] }),

      // 5. Drawer UI 제어
      toggleDrawer: (isOpen) => set({ isDrawerOpen: isOpen }),
    }),
    {
      name: 'sharedit-cart-storage', // 브라우저 저장소 키 이름
    }
  )
);

export default useCartStore;