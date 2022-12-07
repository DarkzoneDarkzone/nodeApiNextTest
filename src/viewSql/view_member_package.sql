select `current`.`pack_id` AS `pack_id`,
       `current`.`package_id` AS `package_id`,
       `current`.`name` AS `name`,
       `current`.`gender` AS `gender`,
       `current`.`mem_id` AS `mem_id`,
       `current`.`username` AS `username`,
       `current`.`isStore` AS `isStore`,
       `current`.`package_priority` AS `package_priority`,
       `current`.`buy_limit` AS `buy_limit`,
       `current`.`show_img_limit` AS `show_img_limit`,
       `current`.`show_gift` AS `show_gift`,
       `current`.`store_detail_limit` AS `store_detail_limit`,
       `current`.`price_sell` AS `price_sell`,
       `current`.`row_number() OVER (ORDER BY current_pack.package_priority ASC)` AS `row_number() OVER (ORDER BY current_pack.package_priority ASC)` 
from (
       select `current_pack`.`pack_id` AS `pack_id`,
              `current_pack`.`package_id` AS `package_id`,
              `current_pack`.`name` AS `name`,
              `current_pack`.`gender` AS `gender`,
              `current_pack`.`mem_id` AS `mem_id`,
              `current_pack`.`username` AS `username`,
              `current_pack`.`isStore` AS `isStore`,
              `current_pack`.`package_priority` AS `package_priority`,
              `db_fillfin`.`package_status`.`buy_limit` AS `buy_limit`,
              `db_fillfin`.`package_status`.`show_img_limit` AS `show_img_limit`,
              `db_fillfin`.`package_status`.`show_gift` AS `show_gift`,
              `db_fillfin`.`package_status`.`store_detail_limit` AS `store_detail_limit`,
              `db_fillfin`.`package_status`.`price_sell` AS `price_sell`,
              row_number() over ( order by `current_pack`.`package_priority`) AS `row_number() OVER (ORDER BY current_pack.package_priority ASC)` 
       from (
              (select `db_fillfin`.`package`.`pack_id` AS `pack_id`,
                     `db_fillfin`.`package`.`package_id` AS `package_id`,
                     `db_fillfin`.`package`.`name` AS `name`,
                     `db_fillfin`.`package`.`gender` AS `gender`,
                     `db_fillfin`.`members`.`id` AS `mem_id`,
                     `db_fillfin`.`members`.`username` AS `username`,
                     `db_fillfin`.`members`.`isStore` AS `isStore`,
                     row_number() over ( order by `db_fillfin`.`package`.`priority` desc) AS `package_priority` 
              from (
                     (
                            (`db_fillfin`.`members` 
                            left join `db_fillfin`.`store` 
                            on (`db_fillfin`.`members`.`username` = `db_fillfin`.`store`.`username`)
                            ) join `db_fillfin`.`package`
                     ) 
                     left join `db_fillfin`.`package_order` 
                     on(`db_fillfin`.`package_order`.`member_id` = `db_fillfin`.`members`.`id` 
                            and `db_fillfin`.`package_order`.`package_id` = `db_fillfin`.`package`.`package_id` 
                            and `db_fillfin`.`package`.`gender` = `db_fillfin`.`package_order`.`gender`)
              ) 
              where `db_fillfin`.`package_order`.`member_id` = `db_fillfin`.`members`.`id` 
                     and `db_fillfin`.`package_order`.`status_confirm` = 'confirm' 
                     and `db_fillfin`.`package_order`.`status_payment` = 'confirm' 
                     and `db_fillfin`.`package_order`.`status_expire` = 'no' 
                     or `db_fillfin`.`package`.`set_default` = 'yes' 
                     and `db_fillfin`.`members`.`isStore` = 'no' 
                     or `db_fillfin`.`members`.`isStore` = 'yes' 
                     and `db_fillfin`.`package`.`package_id` = 'PACKAGE_EXCLUSIVE' 
                     and `db_fillfin`.`store`.`gender` = `db_fillfin`.`package`.`gender`
              ) `current_pack` 
       join `db_fillfin`.`package_status` 
       on(`current_pack`.`package_id` = `db_fillfin`.`package_status`.`package_id`)
       )
) `current` group by `current`.`mem_id`,`current`.`gender`