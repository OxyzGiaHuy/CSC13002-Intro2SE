describe('Test 1: Login & View Trails', () => {
  beforeEach(() => {
    // Vào trang web
    cy.visit('http://localhost:3000'); 
  });

  it('Đăng nhập và xem danh sách Trails thành công', () => {
    // --- PHẦN 1: ĐĂNG NHẬP (Như cũ) ---
    cy.get('input[type="email"]').type('admin@trailsexplorer.com'); 
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Kiểm tra đã qua được màn hình login chưa
    cy.url().should('not.include', '/login');

    // --- PHẦN 2: VIEW TRAILS (BỔ SUNG) ---
    
    // 1. Tìm và bấm vào menu "Discover" trên thanh điều hướng
    cy.contains('Discover').click();

    // 2. Kiểm tra xem trang Discover đã hiện ra chưa
    // (Dựa vào hình ông gửi: Phải hiện chữ "Discover Trails" to đùng)
    cy.contains('Discover Trails').should('be.visible');

    // 3. Kiểm tra xem danh sách các địa điểm có load lên không
    // Robot sẽ chờ (mặc định 4s) để tìm chữ "Tà Năng - Phan Dũng" hoặc "Fansipan"
    // Nếu thấy nghĩa là API đã trả về dữ liệu thành công
    cy.contains('Tà Năng - Phan Dũng').should('be.visible');
    
    // (Tùy chọn) Kiểm tra luôn cái nút "View Details" có hiện không cho chắc
    cy.contains('View Details').should('be.visible');
  });
});