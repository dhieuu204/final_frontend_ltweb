/**
 * fetchModel - Gửi yêu cầu GET đến server để lấy model dữ liệu.
 *
 * @param {string} url - Đường dẫn API tương đối (ví dụ: "/user/list")
 * @returns {Promise<any>} - Promise trả về dữ liệu JSON hoặc null nếu lỗi
 */
function fetchModel(url) {
  // Gọi API đến server backend tại localhost:8081
  return fetch("http://localhost:8081/api" + url)
    .then((response) => {
      if (!response.ok) {
        // Nếu lỗi HTTP, ném ra lỗi để catch xử lý
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Trả về JSON nếu thành công
      return response.json();
    })
    .catch((error) => {
      console.error("Lỗi khi fetchModel:", error.message);
      return null;
    });
}

export default fetchModel;
