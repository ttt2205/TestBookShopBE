## Command Line

- **Tạo bảng từ folder migration**
  ```bash
  npx sequelize-cli db:migrate
  ```
- **Tạo data từ seed:**
  ```bash
  npx sequelize db:seed:all
  ```
- **Tạo model từ db có sẵn:**
  ```bash
  npx sequelize-auto -d <database_name> -h 127.0.0.1 -u root -p 3306 -e mysql -o './src/models'
  ```
- **Tạo model**
  ```bash
  npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
  ```
