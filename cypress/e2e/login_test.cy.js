describe('Test 1: Login & View Trails', () => {
  beforeEach(() => {
    // Vào trang web
    cy.visit('http://localhost:3000'); 
  });

  it('Đăng nhập và xem danh sách Trails thành công', () => {
    // --- PHẦN 1: ĐĂNG NHẬP ---
    // (Lưu ý: Ông dùng đúng email/pass mà ông vừa đăng nhập được trên web nhé)
    cy.get('input[type="email"]').type('hktn2403@gmail.com'); 
    cy.get('input[type="password"]').type('kimtris123');
    cy.get('button[type="submit"]').click();

    // Kiểm tra đã qua được màn hình login chưa
    cy.url().should('not.include', '/login');

    // --- PHẦN 2: VIEW TRAILS (ĐÃ SỬA CHO KHỚP HÌNH) ---
    
    // 1. Tìm và bấm vào menu "Discover" (Cái nút màu xanh lá trên cùng)
    // Dùng class hoặc text cụ thể để tránh bấm nhầm
    cy.contains('Discover').click();
    // Hoặc nếu không có thẻ a thì giữ nguyên: cy.contains('Discover').click();

    // 2. Kiểm tra tiêu đề trang (SỬA LẠI KHỚP VỚI HÌNH)
    // Trên hình ông gửi là dòng chữ này:
    cy.contains('Explore the Great Outdoors').should('be.visible');

    // 3. Kiểm tra xem danh sách trails có hiện cái đầu tiên không
    // Trên hình thấy rõ "Đỉnh Fansipan", nên mình bắt nó tìm cái này
    cy.contains('Đỉnh Fansipan - Nóc nhà Đông Dương').should('be.visible');
    
    // 4. Kiểm tra các thẻ tag (Ví dụ thẻ "HARD" màu đỏ trong hình)
    cy.contains('HARD').should('be.visible');
  });
});