<?php

mysql_connect("qdm723417486.my3w.com:3306", "qdm723417486", "Xiao1Ban"); //连接MySQL
mysql_select_db("qdm723417486_db"); //选择数据库
mysql_query("set names utf8"); //**设置字符集***

$sql = "select * from dict Where E like '%" . $_POST['value'] . "%' or C like '%" . $_POST['value'] . "%'";


$result = mysql_query($sql); //借SQL语句插入数据
$i = 1;
while ($row = mysql_fetch_array($result)) {
    echo "<tr>";
    echo "<td>" . (string)$i . "</td>";
    echo "<td>" . $row['E'] . "</td>";
    echo "<td>" . $row['C'] . "</td>";
    echo "</tr>";
    $i = $i + 1;
}
mysql_close();
