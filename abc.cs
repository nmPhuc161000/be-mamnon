
// Cách làm phổ biến và hiệu quả nhất
if (listStaff == null || !listStaff.Any())
    return;

// 1. Lấy danh sách các department id duy nhất
var departmentIds = listStaff
    .Select(s => s.DepartmentId)
    .Where(id => id > 0)           // loại bỏ id không hợp lệ nếu cần
    .Distinct()
    .ToList();

// 2. Query 1 lần duy nhất
var departments = departmentIds.Any()
    ? GetDepartmentsByIds(departmentIds)   // cần viết hàm này
    : new List<DepartmentInfo>();

// 3. Chuyển thành Dictionary để tra cứu O(1)
var depDict = departments
    .ToDictionary(
        d => d.Id,
        d => d.Name ?? "Không xác định"
    );

// 4. Gán tên phòng ban
foreach (var s in listStaff)
{
    s.DepartmentName = depDict.TryGetValue(s.DepartmentId, out var name) 
        ? name 
        : "Không xác định";
}

