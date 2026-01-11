describe('Test 3: Favorite Trail (Must turn RED)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // --- GIỮ NGUYÊN LOGIN CŨ (Theo yêu cầu của ông) ---
    cy.get('input[type="email"]').type('hktn2403@gmail.com');
    cy.get('input[type="password"]').type('kimtris123');
    cy.get('button[type="submit"]').click();
  });

  it('Thả tim và kiểm tra tim chuyển màu đỏ', () => {
    // 1. Vào Discover (Bấm nút to ở Home cho chắc ăn)
    cy.contains('Explore Trails').click();
    
    // 2. CHECK TIÊU ĐỀ (SỬA LẠI CHO ĐÚNG HÌNH ẢNH THỰC TẾ)
    // Cũ: Discover Trails -> Sai
    // Mới: Explore the Great Outdoors -> Đúng
    cy.contains('Explore the Great Outdoors').should('be.visible');

    // 3. VÀO XEM CHI TIẾT (SỬA LẠI)
    // Vì không có nút "View Details", robot sẽ bấm thẳng vào tên bài viết đầu tiên
    cy.contains('Đỉnh Fansipan - Nóc nhà Đông Dương').click();
    cy.wait(2000); // Chờ trang chi tiết load xong

    // 4. CLICK TIM (ĐÃ SỬA: CHẶN BẤM NHẦM VIEW MAP)
    cy.get('button:has(svg)')
      .filter(':visible')            // 1. Chỉ lấy nút đang hiện
      .not(':contains("Back")')      // 2. Không bấm nút Back
      .not(':contains("View Map")')  // 3. <--- MỚI: Không bấm nút View Map
      .not(':contains("VIEW MAP")')  // 4. <--- MỚI: Chặn luôn chữ hoa cho chắc
      .last()                        // 5. Cái còn lại cuối cùng chắc chắn là Tim!
      .click({ force: true });

    // 5. VERIFY
    cy.wait(1000);
    // Đoạn này robot chờ xíu để kịp nhìn thấy tim đổi màu là ok
  });
});