import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowLeft, FaClock, FaTag, FaChevronRight, FaHome } from 'react-icons/fa';

// Optimized data for articles (removed views, likes, comments)
const articles = [
  {
    id: 1,
    title: "ILLUMINA - Công nghệ và tiên phong về xét nghiệm Gen tại Việt Nam",
    category: "Knowledge",
    excerpt: "Illumina được ví như 'người khổng lồ' trong lĩnh vực giải trình tự Gen, là công ty thế giới về giải trình tự DNA và công nghệ sinh học phục vụ khách hàng trong việc nghiên cứu, lâm sàng và ứng dụng.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",

    slug: "illumina-cong-nghe-tien-phong-xet-nghiem-gen-viet-nam",
    author: "DNA Testing",

    date: "2024-01-25",
    readTime: "10 min read",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Illumina - Người khổng lồ trong lĩnh vực giải trình tự Gen", level: 1 },
      { id: "2", title: "Cuộc chiến pháp lý chống vi phạm bản quyền của Illumina", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Illumina được ví như 'người khổng lồ' trong lĩnh vực giải trình tự Gen, là công ty thế giới về giải trình tự DNA và công nghệ sinh học phục vụ khách hàng trong việc nghiên cứu, lâm sàng và ứng dụng. Với những cống hiến và nỗ lực phát triển của mình, Illumina ngày càng khẳng định vị thế trong lĩnh vực giải trình tự gen và được sử dụng cho các ứng dụng trong khoa học đời sống, ung thư, sức khỏe sinh sản, nông nghiệp và các ứng dụng đời sống khác.</p>

        <p>Illumina là hãng công nghệ hàng đầu thế giới về giải mã và phân tích gen có trụ sở tại San Diego, California, được thành lập vào năm 1998 với sứ mệnh: "Cải thiện sức khỏe con người bằng cách mở khóa sức mạnh của bộ gen". Hơn hai thập kỷ qua, Illumina đã phát triển các công nghệ tiên phong, chất lượng vượt trội được sử dụng trong nghiên cứu bệnh học, phát triển thuốc và phát triển các xét nghiệm trong lĩnh vực sinh học phân tử.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/about-illumina-web-graphic.jpg" alt="Trụ sở Illumina" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>

        <p>Illumina đã liên kết với hơn 115 quốc gia và lãnh thổ trên thế giới trong đó có Việt Nam và tiếp tục tối ưu các giải pháp trở nên đơn giản hơn, mở rộng và dễ tiếp cận với ngày càng nhiều các nhà nghiên cứu khoa học.</p>

        <h2 id="1">1. Người khổng lồ trong lĩnh vực giải trình tự Gen</h2>
        <p>Nhắc đến giải trình tự gen là nghĩ đến Illumina. Theo thống kê từ Illumina có tới 90% dữ liệu giải trình tự gen trên thế giới được giải trình tự từ hệ thống giải trình tự thế hệ tiếp theo (NGS – Next Generation Sequencing) của Illumina. Được biết, Illumina sử dụng hệ thống NGS Illumina từ năm 2007, được xây dựng dựa trên các phương pháp giải trình tự bộ gen trước đó để giảm đáng kể thời gian cần thiết.</p>

        <p>Illumina đã góp phần vào sự phát triển của các công nghệ, mở ra một kỷ nguyên quan trọng, đặc biệt công nghệ giải trình tự gen của hãng được ứng dụng vào một loạt các nghiên cứu và các xét nghiệm liên quan đến lâm sàng.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/so-lieu-illumina.jpg" alt="Số liệu Illumina" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina kết thúc quý 4 năm 2020 với thu nhập ròng tăng 7,5% so với cùng kỳ năm trước (Nguồn: Illumina)</p>

        <p>Nghiên cứu của Illumina tập trung vào việc phát triển các giải pháp công nghệ, cho phép các nhà nghiên cứu tiếp tục thực hiện những tiến bộ khoa học trong bệnh di truyền, rối loạn di truyền phổ biến, di truyền dân số và sinh học tế bào; nghiên cứu phân tử cơ bản liên quan đến các ứng dụng lâm sàng như sức khỏe sinh sản, xét nghiệm ung thư, xét nghiệm và giám sát bệnh truyền nhiễm.</p>

        <p>Theo đó, công nghệ NGS của Illumina đã giúp cách mạng hóa nghiên cứu bộ gen và có các ứng dụng rộng rãi trong nhiều lĩnh vực như bệnh truyền nhiễm, ung thư, bệnh di truyền, nông nghiệp và trong các môi trường như phòng khám, bệnh viện, phòng thí nghiệm nghiên cứu và các cơ quan chính phủ.</p>

        <p>Trong các nỗ lực kiểm soát dịch bệnh do virus corona gây ra bùng phát đầu năm 2020, hệ thống giải trình tự gen của Illumina được sử dụng để xác định và công bố hồ sơ genome của corona virus trong cơ sở dữ liệu công cộng, đây là bước đầu tiên quan trọng phát triển các xét nghiệm chẩn đoán, tạo tiền đề cho việc điều chế ra vắc xin.</p>

        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/thu-nghiem-DNA.jpg" alt="Illumina và IDbyDNA Khởi chạy thử nghiệm DNA" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;">Illumina và IDbyDNA Khởi chạy thử nghiệm DNA có thể tìm thấy dịch tiếp theo (Nguồn: IDbyDNA)</p>

        <p>Cùng với rất nhiều những cống hiến và nỗ lực của mình, Illumina đang ngày càng khẳng định vị thế trong lĩnh vực giải trình tự gen với các ứng dụng quan trọng về sàng lọc trước sinh không xâm lấn VeriSeq NIPT; sàng lọc di truyền trước chuyển phôi VeriSeq PGS; sàng lọc, chẩn đoán ung thư sớm TSO500.</p>

        <h2 id="2">2. Cuộc chiến pháp lý chống vi phạm bản quyền của Illumina</h2>
        <p>Với những cống hiến quan trọng và mở ra một kỷ nguyên mới cho nền y học thế giới, Illumina đang nắm giữ phần lớn thị phần lĩnh vực giải trình tự gen. Chính vì thế vấn đề về bảo vệ quyền sở hữu các bằng sáng chế và tác quyền cũng trở nên bức thiết hơn bao giờ hết. Thực tế cho thấy nhiều công ty đã sử dụng trái phép các bằng sáng chế này dưới danh nghĩa nghiên cứu khoa học để sao chép và tạo ra các giải pháp công nghệ cho riêng mình. Hành động này đã vi phạm nghiêm trọng bản quyền sáng chế và hãng này đã có những đơn đệ trình để bảo vệ tài sản trí tuệ của mình.</p>

        <p>Cụ thể, theo thông tin truyền thông quốc tế, vào tháng 2 năm 2020, Illumina đã đệ đơn kiện vi phạm bằng sáng chế chống lại BGI liên quan đến các sản phẩm giải trình tự gen. Đầu tháng 1 năm 2021, tại tòa án Công lý Tối cao nước Anh, Phòng Cơ hội và Tòa án Bằng sáng chế đã phán quyết Illumina thắng kiện.</p>

        <p>Theo đó, 4/5 bằng sáng chế được khẳng định là hợp lệ và bị BGI vi phạm. Những bằng sáng chế này đề câp đến các khía cạnh khác nhau của phương pháp giải trình tự bằng sinh học tổng hợp độc quyền của Illumina, bao gồm giải trình tự 2 đầu và đánh dấu các nucleotide.</p>
      </div>
    `
  },
   {
    id: 2,
    title: "Xét nghiệm ADN dân sự và pháp lý: so sánh điểm giống và khác nhau",
    category: "Administration",
    excerpt: "Tìm hiểu sự khác biệt giữa xét nghiệm ADN dân sự và pháp lý để lựa chọn đúng loại xét nghiệm phù hợp với mục đích sử dụng của bạn.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",

    slug: "xet-nghiem-adn-dan-su-va-phap-ly-so-sanh-diem-giong-va-khac-nhau",
    author: "GeneViet",
    date: "2024-03-15",
    readTime: "10 min read",
    featured: true,
    views: 2250,
    likes: 178,
    comments: 42,

    tableOfContents: [
      { id: "1", title: "Tìm hiểu về xét nghiệm ADN cho mục đích dân sự và mục đích pháp lý", level: 1 },
      { id: "2", title: "Xét nghiệm ADN dân sự và pháp lý giống và khác nhau như thế nào?", level: 1 },
      { id: "3", title: "Điểm giống nhau giữa xét nghiệm ADN dân sự và pháp lý", level: 1 },
      { id: "4", title: "Điểm khác nhau giữa xét nghiệm ADN dân sự và pháp lý", level: 1 },
      { id: "5", title: "Lưu ý", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Xét nghiệm ADN ngày càng trở nên phổ biến với nhiều mục đích khác nhau và được chia làm hai nhóm chính là dân sự và pháp lý. Tuy nhiên, nhiều người vẫn còn mơ hồ về sự khác biệt giữa hai loại xét nghiệm này.</p>
        
        <p>Để hiểu rõ hơn về điểm giống và khác nhau giữa xét nghiệm ADN dân sự và pháp lý, mời bạn đọc theo dõi thông tin trong bài viết dưới đây của GeneViet.</p>
        


        <h2 id="1">1. Tìm hiểu về xét nghiệm ADN cho mục đích dân sự và mục đích pháp lý</h2>
        
        <p><strong>Xét nghiệm ADN cho mục đích dân sự</strong></p>
        <p>Xét nghiệm ADN cho mục đích dân sự là việc sử dụng công nghệ phân tích ADN để xác định mối quan hệ huyết thống giữa các cá nhân cho mục đích cá nhân, không sử dụng trong các thủ tục hành chính pháp lý.</p>
        
        <p><strong>Những ứng dụng của xét nghiệm ADN cho mục đích dân sự bao gồm:</strong></p>
        <ul>
          <li><strong>Xác định quan hệ huyết thống:</strong> Đây là ứng dụng phổ biến nhất, giúp giải đáp các nghi ngờ hoặc xác nhận mối quan hệ huyết thống trong gia đình. Nó đặc biệt hữu ích trong các trường hợp cần xác định cha mẹ, anh chị em, họ hàng.</li>
          <li><strong>Nghiên cứu phả hệ và tổ tiên:</strong> Xét nghiệm này giúp mọi người tìm hiểu về nguồn gốc gia đình và tổ tiên của mình. Thông qua kết quả xét nghiệm ADN có thể giúp kết nối với các thành viên gia đình xa xôi hoặc hiểu rõ hơn về lịch sử dòng họ.</li>
          <li><strong>Sức khỏe và y tế:</strong> Xét nghiệm ADN dân sự có thể giúp phát hiện sớm các nguy cơ di truyền, từ đó giúp mọi người có kế hoạch phòng ngừa và quản lý sức khỏe tốt hơn. Ngoài ra, xét nghiệm ADN cũng giúp xác định tính tương thích trong ghép tạng hoặc tìm người hiến tạng phù hợp.</li>
          <li><strong>Tìm kiếm người thân thất lạc:</strong> Trong những trường hợp như nhận con nuôi, mất tích, hoặc các trường hợp thiên tai, xét nghiệm ADN có thể giúp kết nối lại các thành viên gia đình với nhau.</li>
        </ul>
        

        
        <p><strong>Xét nghiệm ADN cho mục đích pháp lý: </strong></p>
        <p>Xét nghiệm ADN cho mục đích pháp lý là việc sử dụng công nghệ phân tích ADN để xác định mối quan hệ huyết thống giữa các cá nhân nhằm phục vụ cho các thủ tục hành chính pháp lý, ví dụ như làm giấy khai sinh, nhập cư, thừa kế, v.v.</p>
        
        <p><strong>Những ứng dụng cụ thể của xét nghiệm ADN pháp lý có thể kể đến bao gồm:</strong></p>
        <ul>
          <li><strong>Hỗ trợ điều tra tội phạm:</strong> Xét nghiệm ADN là một công cụ quan trọng trong việc xác định hoặc loại trừ nghi phạm trong các vụ án hình sự. ADN thu được từ hiện trường tội phạm có thể được so sánh với ADN của nghi phạm hoặc cơ sở dữ liệu tội phạm để tìm ra kẻ gây án.</li>
          <li><strong>Giải quyết tranh chấp gia đình:</strong> Trong các vụ án tranh chấp quyền nuôi con, nhận con nuôi, hoặc tranh chấp di sản, xét nghiệm ADN giúp xác định mối quan hệ huyết thống chính xác, từ đó cung cấp căn cứ pháp lý cho các quyết định của tòa án.</li>
          <li><strong>Nhận diện nạn nhân trong tai nạn hoặc thảm họa:</strong> Khi các phương pháp nhận diện truyền thống không khả thi, xét nghiệm ADN có thể giúp xác định danh tính các nạn nhân, giúp gia đình nhận lại thi thể người thân và hỗ trợ quá trình điều tra nguyên nhân tai nạn.</li>
          <li><strong>Xác minh quan hệ gia đình trong hồ sơ nhập cư:</strong> Các hồ sơ nhập cư thường yêu cầu xác minh mối quan hệ huyết thống giữa người bảo lãnh và người được bảo lãnh. Xét nghiệm ADN cung cấp bằng chứng rõ ràng và chính xác để hỗ trợ quá trình xem xét hồ sơ.</li>
        </ul>

        <h2 id="2">2. Xét nghiệm ADN dân sự và pháp lý giống và khác nhau như thế nào?</h2>
        <p>Có thể khẳng định, xét nghiệm ADN xác định huyết thống cho nhu cầu dân sự/cá nhân và pháp lý/hành chính là hai mục đích chính hiện nay. Điểm giống và khác nhau của hai hình thức này như sau.</p>

        <h2 id="3">3. Điểm giống nhau giữa xét nghiệm ADN dân sự và pháp lý</h2>
        <ul>
          <li><strong>Công nghệ và phương pháp:</strong> Cả xét nghiệm ADN dân sự và pháp lý đều sử dụng cùng công nghệ và phương pháp phân tích ADN. Các bước chính bao gồm thu thập mẫu, chiết xuất ADN, khuếch đại ADN và phân tích mẫu ADN để xác định các đặc điểm di truyền.</li>
          <li><strong>Độ chính xác:</strong> Độ chính xác của kết quả xét nghiệm ADN trong cả hai trường hợp đều rất cao, thường đạt trên 99.99%. Điều này đảm bảo rằng các kết quả đưa ra là đáng tin cậy và có giá trị sử dụng.</li>
          <li><strong>Loại mẫu xét nghiệm:</strong> Các loại mẫu được sử dụng, chẳng hạn như máu, nước bọt, tóc, hoặc móng tay, đều có thể áp dụng cho cả xét nghiệm dân sự và pháp lý.</li>
        </ul>
        
        <div style="text-align: center; margin: 20px 0;">
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop" alt="Xét nghiệm huyết thống dân sự và pháp lý" style="max-width: 100%; height: auto; border-radius: 8px;">
        </div>

        <h2 id="4">4. Điểm khác nhau giữa xét nghiệm ADN dân sự và pháp lý</h2>
        
        <p><strong>Mục đích sử dụng:</strong></p>
        <ul>
          <li><strong>Xét nghiệm ADN dân sự:</strong> Thường được thực hiện cho các mục đích cá nhân hoặc gia đình, như xác định quan hệ huyết thống (cha con, mẹ con, anh chị em), nghiên cứu phả hệ hoặc xác định nguồn gốc tổ tiên.</li>
          <li><strong>Xét nghiệm ADN pháp lý:</strong> Được sử dụng trong các tình huống liên quan đến pháp luật, chẳng hạn như các vụ án hình sự (xác định danh tính nghi phạm), vụ án dân sự (tranh chấp tài sản, quyền nuôi con) và các yêu cầu pháp lý khác (nhập cư, nhận con nuôi).</li>
        </ul>
        
        <p><strong>Quy trình thu thập mẫu:</strong></p>
        <ul>
          <li><strong>Xét nghiệm ADN dân sự:</strong> Thường cho phép tự thu thập mẫu tại nhà theo hướng dẫn của phòng xét nghiệm. Người dùng sẽ nhận được bộ kit thu thập mẫu, tự lấy mẫu và gửi lại phòng xét nghiệm.</li>
          <li><strong>Xét nghiệm ADN pháp lý:</strong> Đòi hỏi quy trình thu thập mẫu nghiêm ngặt hơn, thường được thực hiện bởi các chuyên gia hoặc nhân viên pháp y để đảm bảo tính toàn vẹn của mẫu và độ chính xác của kết quả. Mẫu phải được thu thập và lưu trữ theo quy trình chuẩn để tránh sự can thiệp hoặc làm sai lệch.</li>
        </ul>
        
        <p><strong>Tính pháp lý của kết quả:</strong></p>
        <ul>
          <li><strong>Xét nghiệm ADN dân sự:</strong> Cung cấp kết quả chủ yếu cho mục đích cá nhân và thường không có giá trị pháp lý trong các tranh chấp hoặc vụ án.</li>
          <li><strong>Xét nghiệm ADN pháp lý:</strong> Cung cấp kết quả có giá trị pháp lý, có thể được sử dụng làm bằng chứng trước tòa án. Kết quả này thường đi kèm với báo cáo chi tiết và chữ ký của chuyên gia pháp y.</li>
        </ul>
        
        <p><strong>Chi phí:</strong></p>
        <ul>
          <li><strong>Xét nghiệm ADN dân sự:</strong> Giá xét nghiệm huyết thống cho mục đích dân sự thường thấp hơn do quy trình thu thập mẫu và yêu cầu về bảo mật, quản lý ít nghiêm ngặt hơn.</li>
          <li><strong>Xét nghiệm ADN pháp lý:</strong> Có chi phí cao hơn vì quy trình thu thập, bảo quản mẫu nghiêm ngặt, và yêu cầu chuyên môn cao của các chuyên gia pháp y.</li>
        </ul>
        
        <p><strong>Thời gian trả kết quả:</strong></p>
        <ul>
          <li><strong>Xét nghiệm ADN dân sự:</strong> Thời gian trả kết quả thường nhanh hơn do quy trình đơn giản và ít yêu cầu nghiêm ngặt.</li>
          <li><strong>Xét nghiệm ADN pháp lý:</strong> Thời gian trả kết quả có thể lâu hơn do quy trình kiểm tra nghiêm ngặt và việc phải tuân thủ các quy định pháp lý.</li>
        </ul>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tiêu chí</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Xét nghiệm ADN dân sự</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Xét nghiệm ADN pháp lý</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Mục đích</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cá nhân, gia đình</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thủ tục pháp lý, hành chính</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Thu thập mẫu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Tự thu thập tại nhà</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thực hiện bởi chuyên gia</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Giá trị pháp lý</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Không</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Có</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Chi phí</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thấp hơn</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cao hơn</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian trả kết quả</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Nhanh hơn (3-5 ngày)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Lâu hơn (7-10 ngày)</td>
          </tr>
        </table>

        <h2 id="5">5. Lưu ý</h2>
        <div class="warning-box" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Lưu ý:</strong></p>
          <ul>
            <li>Thông tin trong bài viết này chỉ mang tính chất tham khảo. Để biết thêm chi tiết về xét nghiệm ADN dân sự và pháp lý, bạn nên liên hệ với các phòng xét nghiệm ADN uy tín để được tư vấn cụ thể.</li>
            <li>Các quy định về xét nghiệm ADN pháp lý có thể khác nhau tùy theo quốc gia hoặc khu vực. Do đó, bạn cần tìm hiểu kỹ các quy định này trước khi thực hiện xét nghiệm.</li>
          </ul>
        </div>
        
        <p>Như vậy có thể khẳng định, dù việc xét nghiệm ADN được sử dụng theo mục đích nào thì yêu cầu về tính chính xác của kết quả cũng được đặt lên cao nhất. Nếu quý khách hàng đang tìm kiếm một địa chỉ xét nghiệm ADN uy tín cho các mục đích về dân sự hay pháp lý, hãy liên hệ ngay với GeneViet để được hỗ trợ.</p>
        
        
        <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
          <h3 style="color: #1976D2; margin-top: 0;">Về GeneViet</h3>
          <p>Với hơn 10 năm hoạt động trong lĩnh vực xét nghiệm ADN, GeneViet đã thực hiện hàng triệu các xét nghiệm huyết thống cho khách hàng trong và ngoài nước. Những ưu điểm khi sử dụng dịch vụ tại GeneViet có thể kể đến như:</p>
          
          <ul>
            <li><strong>Độ chính xác cao:</strong> GeneViet sử dụng công nghệ phân tích ADN tiên tiến nhất, đảm bảo kết quả xét nghiệm có độ chính xác trên 99.99%. Các mẫu được xử lý bởi đội ngũ chuyên gia giàu kinh nghiệm và phòng thí nghiệm đạt tiêu chuẩn quốc tế.</li>
            <li><strong>Bảo mật tuyệt đối:</strong> GeneViet cam kết bảo mật thông tin khách hàng ở mức cao nhất. Tất cả các mẫu và dữ liệu xét nghiệm được mã hóa và lưu trữ an toàn, chỉ có những người có thẩm quyền mới được truy cập. Chúng tôi hiểu rằng thông tin di truyền là riêng tư và nhạy cảm, do đó, bảo mật thông tin là ưu tiên hàng đầu của chúng tôi.</li>
            <li><strong>Quy trình linh hoạt và nhanh chóng:</strong> Với các xét nghiệm cho mục đích pháp lý, GeneViet cung cấp bộ kit thu thập mẫu tại nhà, giúp khách hàng dễ dàng tự lấy mẫu và gửi lại cho trung tâm. Quy trình này không chỉ đơn giản, tiết kiệm thời gian mà còn đảm bảo tính riêng tư cho khách hàng. Kết quả xét nghiệm thường được trả trong thời gian ngắn, đáp ứng nhu cầu kịp thời của khách hàng.</li>
            <li><strong>Hỗ trợ tư vấn chuyên nghiệp:</strong> Đội ngũ tư vấn viên của GeneViet luôn sẵn sàng hỗ trợ khách hàng từ khâu thu thập mẫu, giải thích kết quả xét nghiệm đến các khía cạnh pháp lý liên quan. GeneViet cam kết cung cấp dịch vụ tận tâm và chuyên nghiệp.</li>
          </ul>
        </div>
      </div>
    `
  },

{
  id: 3,
  title: "Xét nghiệm ADN cha con dân sự là gì?",
  category: "Knowledge",
  excerpt: "Ngày nay, dịch vụ xét nghiệm ADN cha con dân sự được rất nhiều người quan tâm. Vậy, xét nghiệm ADN là gì? Chi phí hết bao nhiêu? Có thể sử dụng mẫu phẩm gì?",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  slug: "xet-nghiem-adn-cha-con-dan-su-la-gi",
  author: "DNA Testing",
  date: "2024-06-25",
  readTime: "8 min read",
  featured: true,
  tableOfContents: [
    { id: "1", title: "Xét nghiệm ADN cha con dân sự là gì?", level: 1 },
    { id: "2", title: "Các thông tin cần biết khi cần làm xét nghiệm ADN cha con dân sự", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <p class="lead-paragraph">Ngày nay, dịch vụ xét nghiệm ADN cha con dân sự được rất nhiều người quan tâm. Vậy, xét nghiệm ADN là gì? Chi phí hết bao nhiêu? Có thể sử dụng mẫu phẩm gì? Hãy cùng tìm hiểu chi tiết ngay trong bài viết dưới đây.</p>

      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-la-gi-2.jpg" alt="Xét nghiệm ADN cha con dân sự" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>

      <h2 id="1">1. Xét nghiệm ADN cha con dân sự là gì?</h2>
      
      <p>Xét nghiệm ADN cha con dân là loại xét nghiệm tự nguyện, giúp xác minh quan hệ huyết thống giữa người con và người cha giả định mà sau đó, giấy xác nhận kết quả sẽ không được/không có giá trị sử dụng làm bằng chứng pháp lý hoặc sử dụng trong các thủ tục hành chính.</p>

      <p>Thường, xét nghiệm ADN cha con dân sự sẽ được tiến hành trong các trường hợp sau:</p>
      
      <ul>
        <li>Có sự nghi ngờ về quan hệ huyết thống của cha và con, cần được xác minh rõ ràng để giải tỏa nghi ngờ, giái quyết mâu thuẫn, hiểu lầm trong gia đình.</li>
        <li>Người mẹ đơn thân muốn xác nhận huyết thống của con với cha để yêu cầu về trách nhiệm nuôi dưỡng, chu cấp.</li>
        <li>Có xảy ra tranh chấp quyền nuôi con khi cha/mẹ không đăng ký kết hôn, hoặc người cha bị phủ nhận vai trò, không được quyền thăm nuôi, chu cấp con.</li>
      </ul>

      <h2 id="2">2. Các thông tin cần biết khi cần làm xét nghiệm ADN cha con dân sự</h2>
      
      <p>Dưới đây là một số thông tin quan trọng mà bạn cần nắm khi cần làm xét nghiệm ADN cha con dân sự:</p>
      
      <p><strong>- Mẫu phẩm và hình thức lấy mẫu xét nghiệm</strong></p>
      
      <p>Nếu như với mục đích xét nghiệm ADN cha con hành chính, chỉ có 2 loại mẫu phẩm là máu và tế bào niêm mạc miệng được sư dụng, thì với xét nghiệm ADN cha con dân sự, chúng ta có thể chuẩn bị bất cứ loại mẫu phẩm nào để sử dụng cho quá trình xét nghiệm: tóc, móng, máu, nước bọt, cuống rốn, nước ối, nhau thai,… thậm chí là các mẫu phẩm đặc biệt như bã kẹo cao su, đầu lọc thuốc lá hay thậm chí là bao cao su đã qua sử dụng bởi người cần được xác minh huyết thống.</p>
      
      <p>Về hình thức lấy mẫu, vì xét nghiệm ADN cha con dân sự chỉ phục vụ cho mục đích cá nhân, không sử dụng cho các mục đích pháp lý, hành chính, nên việc thu thập mẫu phẩm có thể tiến hành bí mật, tại nhà, hoặc trực tiếp đến tại trung tâm xét nghiệm ADN để được hướng dẫn, hỗ trợ, hoặc yêu cầu nhân viên trung tâm xét nghiệm đến tại nhà để hỗ trợ lấy mẫu,… nhìn chung là tùy vào mong muốn, điều kiện của từng người, từng trường hợp.</p>
      
      <p><strong>- Thủ tục</strong></p>
      
      <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
        <img src="/images/xet-nghiem-adn-cha-con-dan-su-nhung-thong-tin-can-biet-1.jpg" alt="Thủ tục xét nghiệm ADN cha con dân sự" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
      </div>
      
      <p>Thủ tục cho xét nghiệm ADN cha con dân sự rất đơn giản do không có yếu tố pháp lý. Người tham gia, yêu cầu làm xét nghiệm không cần mang theo bất kỳ giấy tờ tùy thân nào, cũng không cần phải khai chính xác thông tin cá nhân mà có thể dùng biệt danh, lựa chọn xét nghiệm ẩn danh. Tất cả những gì cần làm chỉ là liên hệ với trung tâm xét nghiệm để đăng ký xét nghiệm ADN cha con dân sự, nộp phí và chờ đợi kết quả được trả về.</p>
      
      <strong>- Chi phí xét nghiệm ADN cha con dân sự</strong>
      
      <p>Chi phí xét nghiệm ADN cha con dân sự hiện dao động ở mức từ 2,5 triệu, tùy vào yêu cầu thời gian trả kết quả.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
      </table>
      </p>
      <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
        <h3 style="color: #1976D2; margin-top: 0;">Kết luận</h3>
        <p>Xét nghiệm ADN cha con dân sự là một giải pháp hiệu quả để xác định mối quan hệ huyết thống giữa cha và con cho mục đích cá nhân. Với quy trình đơn giản, chi phí hợp lý và khả năng sử dụng nhiều loại mẫu phẩm khác nhau, dịch vụ này đang ngày càng được nhiều người lựa chọn. Tuy nhiên, cần lưu ý rằng kết quả xét nghiệm ADN dân sự không có giá trị pháp lý và không thể sử dụng trong các thủ tục hành chính.</p>
        
        <p>Nếu bạn có nhu cầu làm xét nghiệm ADN cha con dân sự, hãy liên hệ với các trung tâm xét nghiệm ADN uy tín để được tư vấn và hỗ trợ tốt nhất.</p>
      </div>
    </div>
  `
},

  {
    id: 4,
    title: "Phân Biệt Xét Nghiệm ADN Dân Sự Và Hành Chính",
    category: "Knowledge",
    excerpt: "Hiểu rõ sự khác biệt giữa xét nghiệm ADN dân sự và hành chính để lựa chọn đúng loại xét nghiệm phù hợp với nhu cầu của bạn.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",

    slug: "phan-biet-xet-nghiem-adn-dan-su-va-hanh-chinh",
    author: "TS. Nguyễn Văn Minh",
    date: "2024-06-20",
    readTime: "8 phút đọc",
    featured: true,
    views: 1580,
    likes: 167,
    comments: 38,

    tableOfContents: [
      { id: "1", title: "So sánh xét nghiệm ADN dân sự và hành chính", level: 1 },
      { id: "2", title: "Xét nghiệm ADN dân sự - thử nghiệm 'vì mục đích cá nhân'", level: 1 },
      { id: "3", title: "Xét nghiệm ADN hành chính - chính xác và có hiệu lực pháp lý", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Trong xã hội hiện đại, xét nghiệm ADN đóng vai trò quan trọng trong nhiều khía cạnh của cuộc sống, từ giải quyết các vấn đề thừa kế đến xác định mối quan hệ huyết thống. Tuy nhiên, nhiều người vẫn còn nhầm lẫn giữa hai loại xét nghiệm ADN phổ biến: dân sự và hành chính. Hiểu rõ sự khác biệt giữa chúng sẽ giúp bạn lựa chọn đúng loại xét nghiệm phù hợp với nhu cầu của mình.</p>
        
        <h2 id="1">1. So sánh xét nghiệm ADN dân sự và hành chính</h2>
        <p>Trước khi đi sâu vào chi tiết, hãy cùng tìm hiểu sự khác biệt cơ bản giữa hai loại xét nghiệm này qua bảng so sánh sau:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tiêu chí</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Xét nghiệm ADN dân sự</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Xét nghiệm ADN hành chính</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Mục đích sử dụng</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Chỉ sử dụng cho mục đích cá nhân</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Sử dụng cho mục đích pháp lý hoặc hành chính</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Giá trị pháp lý</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Không có giá trị pháp lý</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Có giá trị pháp lý</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Lấy mẫu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Tự lấy mẫu tại nhà</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Phải thực hiện tại cơ sở y tế được ủy quyền</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xác minh danh tính</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Không yêu cầu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Yêu cầu giấy tờ tùy thân và chứng minh danh tính</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Chi phí</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thấp hơn (1-2 triệu đồng)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cao hơn (3-5 triệu đồng)</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian xử lý</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 ngày</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 ngày làm việc</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Quy trình</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Đơn giản, ít thủ tục</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Nghiêm ngặt, tuân thủ quy định pháp luật</td>
          </tr>
        </table>
        
        <h2 id="2">2. Xét nghiệm ADN dân sự - thử nghiệm 'vì mục đích cá nhân'</h2>
        <p>Xét nghiệm ADN dân sự (hay còn gọi là xét nghiệm ADN cá nhân) là loại xét nghiệm được thiết kế để đáp ứng nhu cầu tìm hiểu thông tin về mối quan hệ huyết thống cho mục đích cá nhân. Đây là lựa chọn phù hợp cho những người muốn xác định quan hệ cha con, anh chị em, hoặc các mối quan hệ khác mà không cần sử dụng kết quả cho mục đích pháp lý.</p>
        
        <p><strong>Đặc điểm của xét nghiệm ADN dân sự:</strong></p>
        <ul>
          <li><strong>Tính riêng tư cao:</strong> Thông tin cá nhân và kết quả xét nghiệm được bảo mật tuyệt đối</li>
          <li><strong>Lấy mẫu tại nhà:</strong> Có thể tự lấy mẫu tại nhà bằng bộ kit được cung cấp</li>
          <li><strong>Quy trình đơn giản:</strong> Không yêu cầu giấy tờ tùy thân hoặc chứng minh danh tính</li>
          <li><strong>Chi phí hợp lý:</strong> Chi phí thấp hơn so với xét nghiệm ADN hành chính</li>
          <li><strong>Kết quả nhanh chóng:</strong> Thời gian xử lý và trả kết quả nhanh hơn</li>
        </ul>
        
        <p><strong>Ứng dụng của xét nghiệm ADN dân sự:</strong></p>
        <ul>
          <li>Xác định mối quan hệ cha con cho mục đích an tâm cá nhân</li>
          <li>Tìm hiểu mối quan hệ huyết thống giữa anh chị em</li>
          <li>Xác định quan hệ họ hàng xa (như ông bà-cháu, cô dì chú bác-cháu)</li>
          <li>Tìm hiểu nguồn gốc gia đình hoặc dòng tộc</li>
          <li>Giải đáp nghi ngờ về mối quan hệ huyết thống trong gia đình</li>
        </ul>
        
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Lưu ý quan trọng:</strong> Kết quả xét nghiệm ADN dân sự không có giá trị pháp lý và không thể sử dụng trong các thủ tục hành chính, tố tụng tại tòa án, hay thủ tục di trú.</p>
        </div>

        <h2 id="3">3. Xét nghiệm ADN hành chính - chính xác và có hiệu lực pháp lý</h2>
        <p>Xét nghiệm ADN hành chính (còn gọi là xét nghiệm ADN pháp lý) là loại xét nghiệm được thực hiện theo các quy trình nghiêm ngặt, tuân thủ quy định pháp luật, nhằm đảm bảo kết quả có giá trị pháp lý và có thể sử dụng trong các thủ tục hành chính, tố tụng tại tòa án.</p>
        
        <p><strong>Quy trình xét nghiệm ADN hành chính:</strong></p>
        <ul>
          <li><strong>Đặt lịch hẹn:</strong> Liên hệ với cơ sở y tế được ủy quyền để đặt lịch xét nghiệm</li>
          <li><strong>Chuẩn bị giấy tờ:</strong> CMND/CCCD/Hộ chiếu, giấy khai sinh (đối với trẻ em dưới 14 tuổi)</li>
          <li><strong>Xác minh danh tính:</strong> Danh tính của tất cả các bên tham gia đều được xác minh</li>
          <li><strong>Lấy mẫu sinh học:</strong> Thực hiện tại cơ sở y tế bởi nhân viên y tế chuyên nghiệp</li>
          <li><strong>Phân tích mẫu:</strong> Sử dụng công nghệ tiên tiến, phân tích ít nhất 16-24 vị trí STR</li>
          <li><strong>Kiểm tra chất lượng:</strong> Kết quả được kiểm tra bởi ít nhất 2 chuyên gia</li>
          <li><strong>Cấp giấy chứng nhận:</strong> Kết quả được cấp kèm giấy chứng nhận có con dấu hợp pháp</li>
        </ul>
        
        <p><strong>Ứng dụng của xét nghiệm ADN hành chính:</strong></p>
        <ul>
          <li><strong>Giải quyết tranh chấp thừa kế:</strong> Xác định quan hệ huyết thống để phân chia tài sản thừa kế</li>
          <li><strong>Đăng ký khai sinh:</strong> Bổ sung thông tin cha/mẹ trên giấy khai sinh</li>
          <li><strong>Thủ tục nhập quốc tịch:</strong> Chứng minh quan hệ gia đình trong hồ sơ di trú</li>
          <li><strong>Tranh chấp quyền nuôi con:</strong> Xác định quan hệ cha/mẹ-con trong các vụ kiện ly hôn</li>
          <li><strong>Giải quyết tranh chấp dân sự:</strong> Làm bằng chứng trong các vụ kiện dân sự</li>
          <li><strong>Xác minh danh tính:</strong> Trong các trường hợp nghi ngờ về danh tính hoặc tráo đổi trẻ sơ sinh</li>
        </ul>
        
        <p><strong>Các cơ sở thực hiện xét nghiệm ADN hành chính:</strong></p>
        <ul>
          <li>Viện Pháp y Quốc gia và các chi nhánh trên toàn quốc</li>
          <li>Các bệnh viện đa khoa tuyến trung ương và tuyến tỉnh được cấp phép</li>
          <li>Các trung tâm xét nghiệm ADN được Bộ Y tế cấp phép</li>
          <li>Các phòng thí nghiệm có chứng nhận ISO 17025 về xét nghiệm ADN</li>
        </ul>
        
        <div class="warning-box" style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196F3;">
          <p><strong>Tiêu chí lựa chọn cơ sở xét nghiệm ADN uy tín:</strong></p>
          <ul>
            <li>Được cấp phép bởi Bộ Y tế và có chứng nhận quốc tế (ISO, AABB, CAP)</li>
            <li>Có đội ngũ chuyên gia được đào tạo chuyên sâu và có kinh nghiệm</li>
            <li>Sử dụng công nghệ xét nghiệm hiện đại và thiết bị tiên tiến</li>
            <li>Có quy trình bảo mật thông tin và kết quả xét nghiệm nghiêm ngặt</li>
            <li>Có dịch vụ tư vấn trước và sau xét nghiệm chuyên nghiệp</li>
            <li>Có nhiều năm kinh nghiệm trong lĩnh vực xét nghiệm di truyền</li>
          </ul>
        </div>

        <p><strong>Những lưu ý khi thực hiện xét nghiệm ADN hành chính:</strong></p>
        <ul>
          <li><strong>Đặt lịch trước:</strong> Nên đặt lịch hẹn trước để tránh chờ đợi và đảm bảo đủ thời gian cho thủ tục</li>
          <li><strong>Mang theo giấy tờ đầy đủ:</strong> CMND/CCCD/Hộ chiếu gốc và bản sao công chứng, giấy khai sinh của trẻ em</li>
          <li><strong>Đảm bảo sự có mặt của các bên:</strong> Tất cả các bên liên quan phải có mặt để lấy mẫu</li>
          <li><strong>Không ăn uống trước khi lấy mẫu:</strong> Tránh ăn, uống, hút thuốc ít nhất 30 phút trước khi lấy mẫu</li>
          <li><strong>Tư vấn trước xét nghiệm:</strong> Nên tham gia buổi tư vấn để hiểu rõ về quy trình và ý nghĩa của kết quả</li>
          <li><strong>Chi phí cao hơn:</strong> Chuẩn bị sẵn kinh phí vì chi phí xét nghiệm ADN hành chính cao hơn xét nghiệm dân sự</li>
        </ul>
        
        <div class="conclusion-box" style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ccc;">
          <h3 style="color: #1976D2; margin-top: 0;">Kết luận</h3>
          <p>Việc hiểu rõ sự khác biệt giữa xét nghiệm ADN dân sự và xét nghiệm ADN hành chính sẽ giúp người dân chọn đúng loại xét nghiệm phù hợp với mục đích của mình, tránh mất thời gian, chi phí và rắc rối pháp lý. Nếu bạn cần xác nhận huyết thống chỉ để biết cho bản thân, xét nghiệm dân sự là lựa chọn đơn giản và kín đáo. Ngược lại, nếu cần dùng kết quả cho mục đích pháp lý – hãy chọn xét nghiệm hành chính tại các trung tâm uy tín, được cấp phép thực hiện và cung cấp kết quả hợp pháp.</p>
          
         
        </div>
        
        


      </div>
    `
  },


  {
    id: 5,
    title: "Bảng giá dịch vụ của Genetix",
    category: "Knowledge",
    excerpt: "Trung tâm xét nghiệm ADN Genetix cung cấp đa dạng các gói dịch vụ xét nghiệm ADN với mức giá cạnh tranh và ưu đãi hấp dẫn.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",

    slug: "bang-gia-dich-vu-genetix",
    author: "Genetix DNA Center",
    date: "2024-06-15",
    readTime: "5 phút đọc",

    featured: true,
    views: 2650,
    likes: 194,
    comments: 51,
    tableOfContents: [
      { id: "1", title: "Xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing)", level: 1 },
      { id: "2", title: "Xét nghiệm ADN pháp lý (Legal DNA Testing)", level: 1 },
      { id: "3", title: "Chế độ ưu đãi (Ưu đãi cho):", level: 1 },
      { id: "4", title: "Lưu ý khi lựa chọn dịch vụ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Trung tâm xét nghiệm ADN Genetix tự hào cung cấp các dịch vụ xét nghiệm ADN chất lượng cao với giá cả cạnh tranh. Chúng tôi cung cấp hai loại dịch vụ xét nghiệm ADN chính: xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing) và xét nghiệm ADN pháp lý (Legal DNA Testing).</p>
        
        <h2 id="1">1. Xét nghiệm ADN không đủ giá trị pháp lý (Non-Legal DNA Testing)</h2>
        <p>Phù hợp với các mục đích cá nhân mà không cần sử dụng kết quả cho thủ tục pháp lý. Thủ tục đơn giản, chi phí thấp và bảo mật cao.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Dịch vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Số lượng mẫu cần lấy</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá niêm yết</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá ưu đãi</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha - con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (cha con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VNĐ</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm mẹ - con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (mẹ con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,000,000 VNĐ</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm anh/chị/em (không cần mẹ/cha)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-3 người (anh em)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VNĐ</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cô/dì/chú bác...</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-4 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3,500,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2,500,000 VNĐ</td>
          </tr>
        </table>
        
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #007bff;">
          <p><strong>Đặc điểm xét nghiệm ADN không đủ giá trị pháp lý:</strong> Phù hợp với các mục đích cá nhân như: xác minh quan hệ huyết thống, để biết thông tin cho bản thân, tìm hiểu về nguồn gốc dòng họ. Thủ tục đơn giản, chi phí thấp, có thể tự lấy mẫu tại nhà, thời gian xử lý nhanh chóng.</p>
        </div>

        <h2 id="2">2. Xét nghiệm ADN pháp lý (Legal DNA Testing)</h2>
        <p>Đáp ứng các yêu cầu pháp lý khi cần xác định quan hệ huyết thống cho các thủ tục hành chính, tố tụng tại tòa án, thủ tục di trú.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Dịch vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Số lượng người</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá niêm yết</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Giá ưu đãi</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha-con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm mẹ-con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm quan hệ khác, trong họ hàng</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">2-7 người</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6,000,000 VNĐ</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+2,500,000 VNĐ</td>
          </tr>
        </table>
        
        <div class="important-note" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
          <p><strong>Đặc điểm xét nghiệm ADN pháp lý:</strong> Dịch vụ chuyên cho thủ tục pháp lý như: đăng ký khai sinh, bổ sung thông tin cha/mẹ trên giấy khai sinh, thủ tục nhập quốc tịch, giải quyết tranh chấp thừa kế. Lấy mẫu tại cơ sở y tế, có xác minh danh tính, phí cao hơn, quy trình nghiêm ngặt và được thực hiện bởi nhân viên y tế chuyên nghiệp.</p>
        </div>

        <h2 id="3">3. Chế độ ưu đãi (Ưu đãi cho):</h2>
        <p>Genetix cung cấp nhiều ưu đãi hấp dẫn cho khách hàng:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📦</span>
            <strong>Chi phí trọn gói:</strong> Nhận mẫu đến khi trả kết quả 300.000 VNĐ
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">🏆</span>
            <strong>Giá ưu đãi (giảm đến):</strong> 250.000 VNĐ
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FFD700; border-radius: 50%; margin-right: 10px;">📋</span>
            <strong>Giấm thêm nếu đi kèm gói khác:</strong> 250.000 VNĐ
          </li>
        </ul>

        <h2 id="4">4. Lưu ý khi lựa chọn dịch vụ</h2>
        <p>Một số lưu ý quan trọng khi lựa chọn dịch vụ xét nghiệm ADN:</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Giá không phụ thuộc lý do:</strong> Dù lý do đi xét nghiệm khác nhau, giá dịch vụ đều giữ ở mức cao nhất để đảm bảo chất lượng
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Giá phù hợp với thủ tục:</strong> Các xét nghiệm cho thủ tục di trú, đơn xin cứu xét, thủ tục pháp lý sẽ cao hơn so với thủ tục dân sự để đảm bảo tính chính xác và giá trị pháp lý
          </li>
          <li style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; background-color: #FF6B6B; border-radius: 50%; margin-right: 10px;">⚠️</span>
            <strong>Dịch vụ chuyên nghiệp:</strong> Genetix cam kết phục vụ nghiêm túc, kết quả chính xác với quy trình 1-2 ngày làm việc cho 7-8 ngày trả kết quả
          </li>
        </ul>
        
    `
  },
// ... existing code ...
  {
    id: 6,
    title: "Thủ tục xét nghiệm - Xét nghiệm ADN",
    category: "Administration",
    excerpt: "Hướng dẫn chi tiết về thủ tục xét nghiệm ADN cho mục đích dân sự, cá nhân và mục đích pháp lý tại Trung tâm công nghệ sinh học phân tử ADNchacon.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    slug: "thu-tuc-xet-nghiem-adn",
    author: "ADNchacon",
    date: "2024-01-16",
    readTime: "7 min read",
    featured: false,
    views: 1320,
    likes: 89,
    comments: 22,
    tableOfContents: [
      { id: "1", title: "XÉT NGHIỆM ADN CHO MỤC ĐÍCH DÂN SỰ, CÁ NHÂN", level: 1 },
      { id: "2", title: "XÉT NGHIỆM ADN CHO MỤC ĐÍCH PHÁP LÝ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">I. XÉT NGHIỆM ADN CHO MỤC ĐÍCH DÂN SỰ, CÁ NHÂN</h2>
        <p>Quý khách có thể sử dụng các kết quả xét nghiệm ADN cha con để phục vụ mục đích chỉ để xác định mối quan hệ người thân của mình có cùng quan hệ huyết thống hay không và có được các quyết định riêng của mình.</p>
        
        <p>Thủ tục xét nghiệm ADN chỉ khoảng 15 phút gồm các bước sau:</p>
        
        <p><strong>Bước 1: Đăng ký xét nghiệm ADN</strong></p>
        <p>Quý khách cần lựa chọn chính xác mục đích xét nghiệm để tư vấn viên có thể tư vấn chính xác và thực hiện các thủ tục phù hợp với mục đích xét nghiệm ADN.</p>
        
        <p><strong>Bước 2: Mẫu xét nghiệm ADN</strong></p>
        <ul>
          <li>Tư vấn viên của trung tâm sẽ tư vấn các bước lấy mẫu và loại mẫu phù hợp với hoàn cảnh của quý khách.</li>
          <li>Tư vấn viên sẽ thực hiện lấy mẫu tại trung tâm hoặc hướng dẫn quý khách lấy mẫu chính xác để gửi tới trung tâm.</li>
        </ul>
        
        <p><strong>Bước 3: Trả kết quả xét nghiệm ADN</strong></p>
        <p>Để đảm bảo tính bảo mật cho khách hàng, chúng tôi chỉ trả kết quả xét nghiệm cho người đứng trên Đơn đề nghị và số điện thoại đăng ký nhận kết quả hoặc biên nhận thu tiền của LOCI hoặc trả theo yêu cầu người đứng đơn.</p>
        
        <h2 id="2">II. XÉT NGHIỆM ADN CHO MỤC ĐÍCH PHÁP LÝ</h2>
        <p>Trung tâm công nghệ sinh học phân tử ADNchacon thuộc Viện sinh học phân tử LOCI là đơn vị tiên phong trong lĩnh vực xét nghiệm huyết thống đáng tin cậy đã được công dân, các tổ chức, cơ quan trong và ngoài nước tin dùng. Trong nhiều năm qua, chúng tôi thường xuyên cung cấp dịch vụ xét nghiệm ADN cho mục đích pháp lý cho:</p>
        
        <ul>
          <li>Đại sứ quán các nước tại Việt Nam: Mục đích di dân, nhập tịch, xin visa.</li>
          <li>Tòa án nhân dân các cấp.</li>
          <li>Ủy ban Nhân dân Phường/ Xã – Quận/ Huyện: mục đích Khai Sinh</li>
          <li>Cơ quan tư pháp, Sở tư pháp các tỉnh thành.</li>
        </ul>
        
        <p>Thủ tục xét nghiệm ADN cho mục đích pháp lý chỉ khoảng từ 15 – 20 phút:</p>
        
        <p><strong>Bước 1: Thủ tục đăng ký xét nghiệm ADN</strong></p>
        <p>Tư vấn viên sẽ tư vấn đăng ký và hoàn thành hồ sơ đăng ký xét nghiệm để làm căn cứ pháp lý. Bao gồm:</p>
        <ul>
          <li>Phiếu đăng ký đề nghị xét nghiệm ADN pháp lý</li>
          <li>Các giấy tờ nhân thân như sau:
            <ul>
              <li>Đối với người mang quốc tịch Việt Nam xin vui lòng mang theo giấy tờ tùy thân bản gốc khi đến thực hiện xét nghiệm</li>
              <li>Đối với trẻ em dưới 16 tuổi chưa có Căn cước công dân hoặc hộ chiếu thì có thể mang theo giấy khai sinh có xác nhận của chính quyền, hoặc giấy chứng sinh của bệnh viện bản gốc.</li>
              <li>Đối với người nước ngoài vui lòng mang Hộ chiếu bản gốc theo để photo sao lưu.</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Bước 2: Lấy mẫu xét nghiệm ADN</strong></p>
        <p>Quý khách bắt buộc phải đến văn phòng chúng tôi thu mẫu trực tiếp, trong trường hợp đi lại gặp khó khăn, quý khách vui lòng gọi điện tới tổng đài 24/7 1900 8043 hoặc 098 604 3113 để được trợ giúp</p>
        
        <p><strong>Chú ý:</strong></p>
        <ul>
          <li>Khách hàng không tự thu mẫu tại nhà. Kỹ thuật viên của trung tâm sẽ thực hiện các bước thu mẫu theo đúng quy trình để đảm bảo kết quả có tính chính xác và pháp lý.</li>
          <li>Khi thực hiện lấy mẫu xét nghiệm ADN khách hàng không phải nhịn ăn uống hoặc dùng thuốc chữa bệnh.</li>
        </ul>
        
        <p><strong>Bước 3: Nhận kết quả xét nghiệm ADN</strong></p>
        <p>Để đảm bảo tính bảo mật, chúng tôi chỉ trả kết quả xét nghiệm cho người đứng trên Phiếu đề nghị và số điện thoại đăng ký nhận kết quả hoặc biên nhận thu tiền của ADNchacon hoặc trả theo yêu cầu người đứng đơn.</p>
        
        <p>Trung tâm Công nghệ Sinh học phân tử ADNchacon trả kết quả xét nghiệm ADN theo hình thức sau:</p>
        <ul>
          <li>Đến Trung tâm lấy kết quả xét nghiệm của mình</li>
          <li>Gửi chuyển phát tới địa chỉ theo yêu cầu</li>
          <li>Gửi trả kết quả xét nghiệm ADN vào email</li>
          <li>Thông báo qua điện thoại</li>
        </ul>
        
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/Co-so-vat-chat-Trang-thiet-bi-ADNChacon-3-1024x768.jpg" alt="Trang thiết bị xét nghiệm ADN hiện đại tại ADNchacon" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        <p style="font-style: italic; margin-top: 8px; font-size: 0.9em; text-align: center;"></p>
      </div>
    `
  },
  {
    id: 7,
    title: "Phân Tích Sâu Hệ Thống Booking Xét Nghiệm ADN: Từ Yêu Cầu Đến Triển Khai",
    category: "News",
    excerpt: "Phân tích chi tiết về quy trình thiết kế và triển khai hệ thống đặt lịch xét nghiệm ADN, từ yêu cầu nghiệp vụ đến trải nghiệm người dùng và quản lý trạng thái.",
    image: "/images/big-data.png",
    slug: "phan-tich-he-thong-booking-xet-nghiem-adn",
    author: "Phòng Phát Triển Sản Phẩm",
    date: "2024-01-15",
    readTime: "15 min read",
    featured: false,
    views: 1890,
    likes: 134,
    comments: 28,
    tableOfContents: [
      { id: "1", title: "Yêu Cầu và Luồng Nghiệp Vụ Cốt Lõi", level: 1 },
      { id: "2", title: "Kiến Trúc Hệ Thống và Các Quy Tắc Nghiệp Vụ", level: 1 },
      { id: "3", title: "Thiết Kế Giao Diện và Trải Nghiệm Người Dùng (UI/UX)", level: 1 },
      { id: "4", title: "Logic Chuyên Sâu - Quản Lý Mối Quan Hệ", level: 1 },
      { id: "5", title: "Luồng Thanh Toán và Quản Lý Trạng Thái Booking", level: 1 },
      { id: "6", title: "Diễn Giải Kết Quả Xét Nghiệm", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/G2101041-DNA_analysis.jpg" alt="Phân tích DNA và giải trình tự gen" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        
        <p class="lead-paragraph">Trong thế giới công nghệ y tế, việc xây dựng một hệ thống đặt lịch (booking) hiệu quả không chỉ là về việc chọn ngày giờ. Nó đòi hỏi sự thấu hiểu sâu sắc về quy trình nghiệp vụ, các quy tắc logic phức tạp và trải nghiệm người dùng. Bài viết này sẽ phân tích chi tiết một hệ thống booking cho dịch vụ xét nghiệm ADN, từ những yêu cầu ban đầu đến kiến trúc triển khai, luồng thanh toán và quản lý trạng thái.</p>
        
        <h2 id="1">Phần 1: Yêu Cầu và Luồng Nghiệp Vụ Cốt Lõi</h2>
        <p>Hệ thống cần quản lý hai quy trình xét nghiệm chính, mỗi quy trình phục vụ những nhu cầu khác nhau của khách hàng.</p>
        
        <p><strong>Tự Thu Mẫu và Gửi Mẫu (Chỉ áp dụng cho ADN Dân sự):</strong> Đây là luồng dành cho khách hàng muốn sự riêng tư và chủ động.</p>
        <p>Luồng thực hiện: Đăng ký đặt hẹn → Nhận bộ kit thu mẫu → Tự thu thập mẫu tại nhà → Gửi mẫu đến phòng xét nghiệm → Chờ xử lý và nhận kết quả.</p>
        
        <p><strong>Thu Mẫu Tại Cơ Sở Y Tế (CSYT):</strong> Luồng này đảm bảo tính pháp lý hoặc dành cho khách hàng muốn được hỗ trợ chuyên nghiệp.</p>
        <p>Luồng thực hiện: Đăng ký đặt hẹn → Nhân viên y tế thu mẫu (tại CSYT hoặc tại nhà) → Mẫu được xử lý tại phòng xét nghiệm → Trả kết quả.</p>
        
        <h2 id="2">Phần 2: Kiến Trúc Hệ Thống và Các Quy Tắc Nghiệp Vụ</h2>
        <p>Để hệ thống hóa các luồng trên, chúng tôi định nghĩa các thuộc tính cốt lõi và các quy tắc đi kèm.</p>
        
        <p><strong>Các thành phần chính:</strong></p>
        
        <p>Service Type (Loại dịch vụ):</p>
        <ul>
          <li>Legal (Hành Chính): Các xét nghiệm yêu cầu tính pháp lý cao (khai sinh, nhập tịch, thừa kế).</li>
          <li>Non-Legal (Dân Sự): Các xét nghiệm mang tính cá nhân, không yêu cầu thủ tục pháp lý.</li>
        </ul>
        
        <p>Collection Method (Phương thức thu thập mẫu):</p>
        <ul>
          <li>At Home: Thu mẫu tại địa chỉ của khách hàng.</li>
          <li>At Facility: Khách hàng đến trực tiếp cơ sở y tế để thu mẫu.</li>
        </ul>
        
        <p>Mediation Method (Phương thức vận chuyển/trung gian):</p>
        <ul>
          <li>Postal Delivery (Vận chuyển bưu điện): Khách hàng nhận kit và gửi mẫu qua đơn vị vận chuyển thứ ba.</li>
          <li>Staff Collection (Nhân viên thu mẫu): Nhân viên của CSYT đến tận nhà khách hàng để thu mẫu.</li>
          <li>Walk-in Service (Khách tự đến): Khách hàng tự đến CSYT để thực hiện.</li>
        </ul>
        
        <p><strong>Các quy tắc nghiệp vụ quan trọng:</strong></p>
        <ul>
          <li>Postal Delivery chỉ áp dụng cho dịch vụ Non-Legal (Dân sự).</li>
          <li>Khi chọn Postal Delivery, khách hàng bắt buộc phải thanh toán trả trước qua cổng thanh toán (VNPay) vì có sự tham gia của bên vận chuyển thứ ba.</li>
          <li>Express Service (Dịch vụ ưu tiên trả kết quả sớm) chỉ áp dụng cho Staff Collection và Walk-in Service.</li>
          <li>Đối với Postal Delivery, khách hàng có 3 ngày để gửi lại bộ kit chứa mẫu sau khi nhận. Quá hạn, lịch hẹn sẽ tự động bị hủy.</li>
        </ul>
        
        <h2 id="3">Phần 3: Thiết Kế Giao Diện và Trải Nghiệm Người Dùng (UI/UX)</h2>
        <p>Sau khi khách hàng chọn một dịch vụ cụ thể và nhấn "Đặt lịch", họ sẽ được chuyển đến trang Booking với một biểu mẫu thông minh, hiển thị các lựa chọn dựa trên quy tắc đã định.</p>
        
        <p><strong>Luồng lựa chọn của người dùng:</strong></p>
        <ul>
          <li>Loại dịch vụ & Tên dịch vụ: Được chọn từ trang trước.</li>
          <li>Phương thức thu thập mẫu (Collection Method):
            <ul>
              <li>Nếu chọn At Home, một ô nhập địa chỉ sẽ xuất hiện.</li>
              <li>Nếu chọn At Facility, hệ thống sẽ hiển thị địa chỉ cố định của CSYT.</li>
            </ul>
          </li>
          <li>Phương thức vận chuyển (Mediation Method): Đây là phần có logic phức tạp nhất, các lựa chọn sẽ được lọc tự động:
            <ul>
              <li>Nếu dịch vụ là Legal (Hành chính):
                <ul>
                  <li>At Home → Chỉ có lựa chọn Staff Collection.</li>
                  <li>At Facility → Chỉ có lựa chọn Walk-in Service.</li>
                </ul>
              </li>
              <li>Nếu dịch vụ là Non-Legal (Dân sự):
                <ul>
                  <li>At Home → Có 2 lựa chọn: Postal Delivery hoặc Staff Collection.</li>
                  <li>At Facility → Chỉ có lựa chọn Walk-in Service.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Dịch vụ ưu tiên (Express Service): Một checkbox chỉ hiển thị khi Mediation Method là Staff Collection hoặc Walk-in Service.</li>
          <li>Lịch hẹn (Schedule):
            <ul>
              <li>Postal Delivery: Khách hàng chọn ngày nhận kit.</li>
              <li>Staff Collection / Walk-in Service: Khách hàng chọn ngày và khung giờ cụ thể. Hệ thống sẽ vô hiệu hóa các khung giờ đã qua trong ngày hiện tại.</li>
            </ul>
          </li>
          <li>Chi phí (Cost): Được tính toán tự động và minh bạch.
            <ul>
              <li>Service Cost: Phí dịch vụ xét nghiệm.</li>
              <li>Mediation Method Cost:
                <ul>
                  <li>Postal Delivery: 250,000 VND</li>
                  <li>Staff Collection: 500,000 VND</li>
                  <li>Walk-in Service: 0 VND</li>
                </ul>
              </li>
              <li>Express Service Cost: Phí dịch vụ nhanh.</li>
              <li>Total Cost: Tổng các chi phí trên.</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Lưu ý đặc biệt:</strong> Nếu khách hàng chọn Staff Collection và Express Service, Total Cost = Service Cost + Express Service Cost. Phí Mediation Method (500,000 VND) sẽ được miễn.</p>
        
        <p><strong>Thông tin người xét nghiệm (Test Subject Information):</strong></p>
        <ul>
          <li>Bao gồm các trường thông tin cá nhân cần thiết như Họ tên, Ngày sinh, Giới tính, SĐT, Email, Mối quan hệ, Loại mẫu, CCCD/CMND.</li>
          <li>Các quy tắc validation được áp dụng (người đại diện >18 tuổi, định dạng email/SĐT, không trùng mối quan hệ...).</li>
        </ul>
        
        <h2 id="4">Phần 4: Logic Chuyên Sâu - Quản Lý Mối Quan Hệ</h2>
        <p>Để đảm bảo tính chính xác, hệ thống chỉ cho phép chọn các cặp quan hệ hợp lệ tương ứng với từng loại dịch vụ xét nghiệm.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tên Dịch Vụ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cặp Quan Hệ Hợp Lệ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Ghi Chú Logic</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Paternity Testing (Cha-Con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Maternity Testing (Mẹ-Con)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Mother - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">NIPT (Thai nhi không xâm lấn)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Mẫu của Child là null (tự động)</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Sibling Testing (Anh/Chị/Em)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Sibling - Sibling</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Grandparent Testing (Ông/Bà-Cháu)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Grandparent - Grandchild</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"></td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Birth Registration</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cho phép một trong hai</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Immigration</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Father - Child<br>Mother - Child<br>Sibling - Sibling<br>Grandparent - Grandchild</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Phải chọn đúng cặp</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">DNA Testing for Inheritance</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;"> Father/Mother - Child<br> Grandparent - Grandchild<br>Sibling - Sibling</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Gợi ý theo thứ tự ưu tiên</td>
          </tr>
        </table>
        
        <p>Trên giao diện, khi khách hàng chọn một dịch vụ, danh sách Mối quan hệ sẽ được lọc tự động để chỉ hiển thị các tùy chọn hợp lệ.</p>
        
        <h2 id="5">Phần 5: Luồng Thanh Toán và Quản Lý Trạng Thái Booking</h2>
        <p>Ngay khi khách hàng nhấn nút "Xác nhận đặt lịch", một booking mới sẽ được tạo với trạng thái Pending Payment, khởi động luồng thanh toán và quản lý trạng thái.</p>
        
        <p><strong>Luồng thanh toán:</strong></p>
        <ul>
          <li>Cash (Tiền mặt):
            <ul>
              <li>Khách hàng xác nhận thông tin.</li>
              <li>Hệ thống yêu cầu ký tên điện tử.</li>
              <li>Thông báo đặt lịch thành công, kèm theo mã thanh toán (paymentCode) để cung cấp cho nhân viên khi thu mẫu.</li>
            </ul>
          </li>
          <li>QR Code (VNPay):
            <ul>
              <li>Khách hàng xác nhận thông tin.</li>
              <li>Hệ thống hiển thị mã QR kèm paymentCode (nội dung chuyển khoản). Khách hàng có 15 phút để thanh toán.</li>
              <li>Nếu quá 15 phút, mã QR hết hạn. Nếu quá 30 phút mà chưa thanh toán, booking sẽ bị hủy.</li>
              <li>Sau khi hệ thống nhận được thanh toán thành công, khách hàng sẽ ký tên điện tử.</li>
              <li>Thông báo đặt lịch thành công.</li>
            </ul>
          </li>
        </ul>
        

        <p><strong>Vòng đời trạng thái của một Booking (Payment Success):</strong></p>
        <p>Awaiting Confirmation → Pending Payment (Chờ thanh toán) → Booking Confirmed (Đã xác nhận & phân công) → Awaiting Sample (Chờ lấy mẫu) → In Progress (Đang xử lý) → Ready (Sẵn sàng trả kết quả) → Completed (Hoàn thành).</p>

        
        <p><strong>Luồng trạng thái trên trang "My Booking" của khách hàng:</strong></p>
        <ul>
          <li>Đối với vận chuyển bưu điện: Đã xác nhận → Đang vận chuyển kit → Đã giao kit → Chờ nhận mẫu → Đang xét nghiệm → Trả kết quả.</li>
          <li>Đối với thu mẫu bởi CSYT: Đã xác nhận → Chờ thu mẫu → Đang xét nghiệm → Trả kết quả.</li>
        </ul>
        

        <h2 id="6">Phần 6: Diễn Giải Kết Quả Xét Nghiệm</h2>
        <p>Cuối cùng, kết quả xét nghiệm được kết luận dựa trên tỷ lệ trùng khớp ADN (Matching Percentage).</p>

        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Mối Quan Hệ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">MATCH (Có quan hệ)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">INCONCLUSIVE (Không xác định)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">NOT MATCH (Không quan hệ)</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Cha – Con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Mẹ – Con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">-</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Anh/Chị/Em ruột</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~50%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–25% (họ hàng gần)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–1%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Ông/Bà – Cháu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~25%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~10–15% (họ hàng xa)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~0–5%</td>
          </tr>
        </table>
        
        <h3>Kết Luận</h3>
        <p>Việc phân tích và thiết kế một hệ thống booking cho dịch vụ chuyên sâu như xét nghiệm ADN là một bài toán phức tạp, đòi hỏi sự kết hợp nhuần nhuyễn giữa logic nghiệp vụ, công nghệ và trải nghiệm người dùng. Bằng cách định nghĩa rõ ràng các quy tắc, phân luồng thông minh và minh bạch hóa thông tin, chúng ta có thể xây dựng một nền tảng không chỉ mạnh mẽ về mặt kỹ thuật mà còn thân thiện và đáng tin cậy với người dùng. Mô hình phân tích này chính là bản thiết kế vững chắc cho giai đoạn phát triển và triển khai sản phẩm.</p>
      </div>
    `
  },
  {
    id: 8,
    title: "THÔNG TIN CHI TIẾT VỀ XÉT NGHIỆM ADN PHÁP LÝ TẠI DNA TESTING",
    category: "Civil Law",
    excerpt: "Ngày nay, bản kết quả của xét nghiệm ADN huyết thống không chỉ được sử dụng để xác định mối quan hệ huyết thống giữa cha và con trong gia đình, cũng như trong các thủ tục hành chính đăng ký khai sinh ở cấp xã/phường, mà còn được sử dụng làm bằng chứng trong các tranh chấp về quyền nuôi con, quyền cấp dưỡng và quyền thừa kế tại tòa án nhân dân các cấp.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop",

    slug: "thong-tin-chi-tiet-xet-nghiem-adn-phap-ly-dna-testing",
    author: "DNA Testing",

    date: "2024-01-12",
    readTime: "9 min read",
    featured: false,
    views: 1150,
    likes: 78,
    comments: 19,
    tableOfContents: [
      { id: "1", title: "Mục đích của xét nghiệm ADN pháp lý", level: 1 },
      { id: "2", title: "Quy trình xét nghiệm ADN pháp lý", level: 1 },
      { id: "3", title: "Cơ sở khoa học", level: 1 },
      { id: "4", title: "Lý do nên chọn DNA – Testing", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Ngày nay, bản kết quả của xét nghiệm ADN huyết thống không chỉ được sử dụng để xác định mối quan hệ huyết thống giữa cha và con trong gia đình, cũng như trong các thủ tục hành chính đăng ký khai sinh ở cấp xã/phường, mà còn được sử dụng làm bằng chứng trong các tranh chấp về quyền nuôi con, quyền cấp dưỡng và quyền thừa kế tại tòa án nhân dân các cấp. Hãy cùng DNA – Testing tìm hiểu chi tiết về thông tin xét nghiệm ADN pháp lý trong bài viết này.</p>
        
        <h2 id="1">Mục đích của xét nghiệm ADN pháp lý</h2>
        <ul>
          <li>Quá trình nhập quốc tịch và định cư.</li>
          <li>Thủ tục làm thị thực, cấp VISA.</li>
          <li>Thực hiện xét nghiệm ADN để nộp hồ sơ bảo lãnh.</li>
          <li>Các thủ tục pháp lý liên quan đến xét nghiệm ADN nhằm hoàn thiện các yêu cầu của Nhà nước.</li>
          <li>Cha nhận con và làm lại giấy khai sinh.</li>
          <li>Làm giấy khai sinh cho con trong trường hợp quá hạn.</li>
          <li>Thực hiện xét nghiệm ADN theo yêu cầu của tòa án.</li>
        </ul>
        
        <h2 id="2">Quy trình xét nghiệm ADN pháp lý</h2>
        <p><strong>Lưu ý:</strong></p>
        <p>Thủ tục có tính pháp lý: Trong trường hợp xét nghiệm ADN mang tính chất pháp lý, khách hàng không được tự thu mẫu và gửi đi xét nghiệm. Việc thu mẫu sẽ được thực hiện bởi nhân viên của Viện Công nghệ ADN và Phân tích Di truyền.</p>
        
        <p><strong>Yêu cầu đối với người tham gia xét nghiệm:</strong></p>
        <ul>
          <li>Xuất trình chứng minh nhân dân, thẻ căn cước hoặc hộ chiếu của mỗi người.</li>
          <li>Xuất trình giấy khai sinh của người con hoặc giấy chứng sinh.</li>
          <li>Điền đầy đủ thông tin trong đơn xin xét nghiệm.</li>
          <li>Chứng kiến quy trình thu mẫu và quá trình niêm phong phong bì đựng mẫu xét nghiệm.</li>
        </ul>
        
        <p><strong>Yêu cầu với người thu mẫu xét nghiệm:</strong></p>
        <ul>
          <li>Kiểm tra và sao chép lưu giữ các giấy tờ tùy thân (CMND, hộ chiếu, giấy khai sinh, giấy chứng sinh…) của người được xét nghiệm.</li>
          <li>Hướng dẫn khách hàng điền đầy đủ thông tin vào đơn xin xét nghiệm. Kiểm tra và xác nhận thông tin chính xác.</li>
          <li>Chụp ảnh lưu hồ sơ.</li>
          <li>Thu mẫu, ghi rõ tên từng người trên phong bì đựng mẫu xét nghiệm tương ứng, niêm phong phong bì đựng mẫu.</li>
        </ul>
        
        <p>Tất cả thông tin về khách hàng và quá trình thu mẫu tại Viện Công nghệ ADN và Phân tích Di truyền sẽ được lưu giữ và bảo mật tuyệt đối.</p>

        <h2 id="3">Cơ sở khoa học</h2>
        <p>Hầu hết DNA của con người rất tương đồng (99.7%) giữa các cá nhân khác nhau. Tuy nhiên, chỉ cần 0.3% sự khác biệt trong bộ gen để phân biệt mỗi người.</p>
        
        <p>Phần nhỏ này chứa những đặc điểm riêng biệt của DNA, được gọi là các marker di truyền, có thể được sử dụng trong các xét nghiệm huyết thống để xác định cha của một đứa trẻ. Mỗi em bé thừa hưởng một nửa DNA từ mẹ và một nửa từ cha, điều này có nghĩa là một phần số marker di truyền của người con sẽ tương ứng với một phần của người cha. Xét nghiệm ADN pháp lý dựa trên những dấu vết di truyền này.</p>
        
        <p>Số lượng marker di truyền được sử dụng trong xét nghiệm càng nhiều, khả năng xác định chính xác mối quan hệ huyết thống cha con càng cao. Do đó, các xét nghiệm ADN pháp lý sử dụng nhiều marker hơn sẽ có độ tin cậy cao hơn.</p>
        
        <p><strong>Đối tượng xét nghiệm ADN pháp lý:</strong></p>
        <ul>
          <li>Cha-Con | Mẹ-Con</li>
          <li>Quan hệ Ông-Cháu trai, Chú (Bác trai)-Cháu Trai, Anh-Em Trai…</li>
          <li>Quan hệ Bà Ngoại-Cháu, Anh chị em Cùng mẹ, Cháu-Chị em gái của mẹ…</li>
        </ul>

        <h2 id="4">Lý do nên chọn DNA – Testing</h2>
        <p>Trung tâm xét nghiệm ADN – DNA Testing có khả năng thực hiện xét nghiệm ADN từ nhiều loại mẫu phẩm khác nhau như: máu, bàn chải đánh răng, móng, tóc, cuống rốn… với độ chính xác cao nhờ vào những ưu điểm vượt trội sau đây:</p>
        
        <ul>
          <li><strong>Trang thiết bị hiện đại:</strong> Phòng xét nghiệm tại Trung tâm xét nghiệm ADN – DNA Testing được đầu tư hơn 2 triệu USD, tuân thủ tiêu chuẩn ISO 15189:2012 và 9001:2015 với trang thiết bị và công nghệ hiện đại, bao gồm các bộ KIT chuyên dùng cho xét nghiệm ADN hình sự như Kit HDPlex, PowerPlex Fusion, Kit Argus X-12, KIT PowerPlex Y23 của Promega – Mỹ, Qiagen – Đức.</li>
          
          <li><strong>Đội ngũ chuyên gia giàu kinh nghiệm:</strong> Tại Trung tâm xét nghiệm ADN – DNA Testing, các chuyên gia thực hiện xét nghiệm ADN đều là những chuyên gia hàng đầu trong lĩnh vực phân tích di truyền. Trong đó, đại tá Hà Quốc Khanh, với hơn 40 năm kinh nghiệm và nhiều chức vụ cao trong ngành, là người đứng đầu giám sát quy trình xét nghiệm.</li>
          
          <li><strong>Thủ tục nhanh chóng:</strong> Các xét nghiệm ADN tại Trung tâm xét nghiệm ADN – DNA Testing được thực hiện với thủ tục ngắn gọn và đơn giản. Đặc biệt, Trung tâm đã mở rộng với hơn 40 điểm thu mẫu và hỗ trợ lấy mẫu tại nhà ở khắp các tỉnh thành trên cả nước.</li>
          
          <li><strong>Trả kết quả trong thời gian ngắn:</strong> Khách hàng có thể nhận được kết quả xét nghiệm ADN từ Trung tâm xét nghiệm ADN – DNA Testing chỉ trong vòng 4 giờ, phụ thuộc vào loại mẫu phẩm và gói dịch vụ mà họ chọn.</li>
          
          <li><strong>Kết quả chính xác:</strong> Với máy móc trang thiết bị tiên tiến và đội ngũ chuyên gia giàu kiến thức kinh nghiệm, kết quả xét nghiệm ADN từ Trung tâm xét nghiệm ADN – DNA Testing đạt độ chính xác cao lên đến khoảng 99.99999998%.</li>
          
          <li><strong>Bảo mật thông tin khách hàng:</strong> Mọi thông tin của khách hàng được cam kết bảo mật tuyệt đối và Trung tâm xét nghiệm ADN – DNA Testing cam kết đảm bảo trách nhiệm với chính sách này.</li>
        </ul>
      </div>
    `
  },
  {
    id: 9,
    title: "AI thiết kế chuỗi ADN, mở ra kỷ nguyên mới công nghệ sinh học",
    category: "Knowledge",
    excerpt: "Trí tuệ nhân tạo đang cách mạng hóa lĩnh vực sinh học bằng cách thiết kế các chuỗi ADN mới, mở ra kỷ nguyên mới cho công nghệ sinh học và y học.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",

    slug: "ai-thiet-ke-chuoi-adn-ky-nguyen-moi-cong-nghe-sinh-hoc",

    author: "Dr. Le Minh Hai",
    date: "2024-01-10",
    readTime: "11 min read",
    featured: false,
    views: 1420,
    likes: 95,
    comments: 26,
    tableOfContents: [
      { id: "1", title: "AI thiết kế chuỗi ADN: Từ mô phỏng sang sáng tạo", level: 1 },
      { id: "2", title: "Cơ hội lớn, thách thức cũng không nhỏ", level: 1 },
      { id: "3", title: "Tương lai thiết kế sinh học có thể giống như lập trình phần mềm", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">AI đang góp mặt vào lĩnh vực sinh học bằng cách thiết kế các chuỗi ADN mới. Công nghệ này giúp tăng tốc nghiên cứu protein, vắc xin, vi sinh vật và nhiều ứng dụng y sinh tiềm năng khác. Một thời, thiết kế sinh học là công việc của các phòng thí nghiệm sinh học phân tử phức tạp. Giờ đây, trí tuệ nhân tạo (AI) mở ra một lĩnh vực mới: thiết kế sinh học bằng máy tính.</p>
        
        <p>Thay vì mất nhiều năm thử nghiệm sinh học truyền thống, các nhà khoa học hiện có thể "lập trình" sinh vật giống như viết phần mềm, và AI chính là công cụ tăng tốc đột phá đó.</p>
        
        <h2 id="1">1. AI thiết kế chuỗi ADN: Từ mô phỏng sang sáng tạo</h2>
        <p>Theo tìm hiểu của Tuổi Trẻ Online, việc giải mã ADN từng là kỳ tích lớn trong sinh học, nay chỉ là bước đầu. Với sự trợ giúp của AI, quá trình đã chuyển từ "đọc" sang "viết" mã di truyền. Các mô hình học sâu (deep learning) được huấn luyện trên hàng triệu trình tự gene, có khả năng nhận biết cấu trúc, chức năng và thậm chí dự đoán cách gene hoạt động trong tế bào.</p>
        
        <p>Một ví dụ điển hình là công cụ như ProGen, mô hình ngôn ngữ gene hoạt động tương tự ChatGPT, nhưng thay vì sinh ra văn bản, nó tạo ra các chuỗi protein mới. Các AI này không chỉ "sáng tác" gene, mà còn đánh giá khả năng gấp cuộn, hoạt động sinh học và tính ứng dụng của sản phẩm.</p>
        
        <p>Điều quan trọng là AI không thay thế nhà khoa học, mà giúp họ rút ngắn đáng kể thời gian thử nghiệm và tối ưu. Một chuỗi ADN có thể có hàng tỉ tổ hợp khác nhau, điều gần như bất khả thi để kiểm tra thủ công. AI giúp chọn ra những tổ hợp khả thi nhất, nhanh và chính xác hơn nhiều lần.</p>
        
        <div style="text-align: center; margin: 20px auto; display: flex; justify-content: center;">
          <img src="/images/AI-thiet-ke-chuoi-ADN.webp" alt="AI thiết kế chuỗi ADN" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto;">
        </div>
        
        <h2 id="2">2. Cơ hội lớn, thách thức cũng không nhỏ</h2>
        <p>Nhờ AI, các công ty công nghệ sinh học đang chế tạo vi khuẩn có khả năng phân hủy nhựa, cây trồng chịu hạn tốt hơn, hay thậm chí vắc xin cá nhân hóa cho từng người.</p>
        
        <p>Trong y học, AI viết mã cho các enzyme phân giải khối u, kháng thể có độ đặc hiệu cao, hay phân tử sinh học dùng để chẩn đoán sớm ung thư.</p>
        
        <p>Tuy nhiên, nhiều chuyên gia cảnh báo rằng công nghệ này cũng tiềm ẩn nguy cơ bị lạm dụng. AI có thể được dùng để thiết kế vi rút hoặc tác nhân sinh học nguy hiểm nếu rơi vào tay kẻ xấu. Chính vì vậy đi cùng với tốc độ phát triển là nhu cầu cấp thiết về kiểm soát đạo đức, minh bạch nguồn dữ liệu huấn luyện và giám sát an toàn sinh học.</p>
        
        <p>Ngoài ra, công nghệ này vẫn còn phụ thuộc vào dữ liệu huấn luyện, nghĩa là AI chỉ mạnh nếu có đủ dữ liệu sinh học chuẩn xác, đa dạng. Với những lĩnh vực còn chưa được nghiên cứu đầy đủ, AI vẫn có thể tạo ra "thiết kế lỗi", hoặc không phù hợp sinh học trong thực tế.</p>
        
        <p>Cuối cùng, cũng cần cân nhắc đến vấn đề bản quyền gene: Khi AI tạo ra một chuỗi ADN chưa từng có, ai là người sở hữu nó? Nhà nghiên cứu, công ty, hay mô hình AI?</p>
        
        <h2 id="3">3. Tương lai thiết kế sinh học có thể giống như lập trình phần mềm</h2>
        <p>Chúng ta đang tiến vào kỷ nguyên nơi sinh vật không chỉ được phát hiện mà còn được "viết nên" từ đầu bởi máy móc. Giống như lập trình viên viết mã cho ứng dụng, nhà sinh học trong tương lai có thể thiết kế vi sinh vật hoặc protein đặc biệt bằng cách mô tả yêu cầu, để AI tính toán phần còn lại.</p>
      </div>
    `
  }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('1');
  const navigate = useNavigate();
  
  // Xử lý chuyển hướng từ URL cũ sang URL mới
  useEffect(() => {
    // Nếu slug là URL cũ của bài viết về phân biệt xét nghiệm ADN
    if (slug === "giai-quyet-tranh-chap-thua-ke-bang-xet-nghiem-adn") {
      // Chuyển hướng đến URL mới
      navigate("/blog/phan-biet-xet-nghiem-adn-dan-su-va-hanh-chinh", { replace: true });
    }
    // Nếu có người truy cập từ URL cũ của bài viết Decoding Life
    else if (slug === "decoding-life-understanding-dna-testing") {
      // Chuyển hướng đến URL mới
      navigate("/blog/nguyen-ly-hoat-dong-cua-xet-nghiem-adn", { replace: true });
    }
  }, [slug, navigate]);
  
  // Find the article by slug
  const article = articles.find(a => a.slug === slug);
  
  // If the article is not found, redirect to the blog page
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">Return to Blog</Link>
        </div>
      </div>
    );
  }

  // Get related articles (same category, different id)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Updated to match services style */}
      <div
        className="relative text-white h-[400px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/images/close-up-hands-typing-keyboard.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              textShadow:
                "1px 1px 0 #808080, -1px -1px 0 #808080, 1px -1px 0 #808080, -1px 1px 0 #808080, 0 1px 0 #808080, 1px 0 0 #808080, 0 -1px 0 #808080, -1px 0 0 #808080",
            }}
          >
            {article.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaUser className="mr-2" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaCalendar className="mr-2" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FaClock className="mr-2" />
              <span>{article.readTime}</span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
              <FaTag className="mr-2" />
              <span>{article.category}</span>
            </div>
          </div>
          
          <p className="text-lg max-w-3xl mx-auto text-white/90 mt-4">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 flex items-center">
              <FaHome className="mr-1" />
              Home
            </Link>
            <FaChevronRight className="text-gray-400" />
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <FaChevronRight className="text-gray-400" />
            <span className="text-gray-800 font-medium">{article.category}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}


              {/* Article Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link 
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.slug}`}
                      className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >

                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mb-2 ${
                          relatedArticle.category === 'Knowledge' ? 'bg-green-500' :
                          relatedArticle.category === 'Administration' ? 'bg-red-500' :
                          relatedArticle.category === 'News' ? 'bg-purple-500' :
                          relatedArticle.category === 'Service' ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}>
                          {relatedArticle.category}
                        </span>
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{relatedArticle.author}</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                📋 Table of Contents:
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${
                      item.level === 2 ? 'ml-4 text-sm' : ''
                    }`}
                  >
                    {item.level === 1 ? `${item.id}. ` : `${item.id} `}
                    {item.title}
                  </button>
                ))}
              </nav>
              
              {/* Back to Blog */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  to="/blog" 
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                >
                  <FaArrowLeft className="mr-2" />
                  Return to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }
        
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #4b5563;
          text-align: justify;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.75rem;
          color: #4b5563;
          line-height: 1.7;
        }
        
        .blog-content strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .blog-content ul li {
          position: relative;
        }
        
        .blog-content ul li::before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: -1.5rem;
        }
        
        .prose {
          max-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;