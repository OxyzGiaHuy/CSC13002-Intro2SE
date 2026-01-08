describe('Test 1: Login & View Trails', () => {
    beforeEach(() => {
      // Vào trang web
      cy.visit('http://localhost:3000'); 
    });
  
    it('Đăng nhập thành công', () => {
      // CÁCH SỬA: Thay vì tìm theo tên, ta tìm theo kiểu (type)
      
      // 1. Tìm cái ô nào dùng để nhập email
      cy.get('input[type="email"]').type('testuser@gmail.com'); 
  
      // 2. Tìm cái ô nào dùng để nhập password (mật khẩu thì chắc chắn type="password")
      cy.get('input[type="password"]').type('123456');
  
      // 3. Tìm cái nút Login (thường là type="submit" hoặc chứa chữ Login)
      cy.get('button[type="submit"]').click();
  
      // 4. Kiểm tra URL thay đổi
      cy.url().should('not.include', '/login');
    });
  });