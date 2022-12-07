(select `product_standard`.`id` AS `id`,
    `product_standard`.`name_premium` AS `name_premium`,
    `product_standard`.`content_premium` AS `content_premium`,
    `product_standard`.`price_premium` AS `price_premium`,
    `product_standard`.`sex` AS `sex`,
    `product_standard`.`pre_order` AS `pre_order`,
    `product_standard`.`clip` AS `clip`,
    `product_standard`.`store_id` AS `store_id`,
    `product_standard`.`store_name` AS `store_name`,
    `product_standard`.`store_profile` AS `store_profile`,
    `product_standard`.`store_concept` AS `store_concept`,
    `product_standard`.`age` AS `age`,
    `product_standard`.`weight` AS `weight`,
    `product_standard`.`height` AS `height`,
    `product_standard`.`bwh` AS `bwh`,
    group_concat(`db_fillfin`.`product_image`.`path_img` separator ',
') AS `product_img` 
from (
    (select `db_fillfin`.`product`.`id` AS `id`,
        `db_fillfin`.`product`.`name_member` AS `name_member`,
        `db_fillfin`.`product`.`content_member` AS `content_member`,
        `db_fillfin`.`product`.`name_premium` AS `name_premium`,
        `db_fillfin`.`product`.`content_premium` AS `content_premium`,
        `db_fillfin`.`product`.`price_standard` AS `price_standard`,
        `db_fillfin`.`product`.`price_premium` AS `price_premium`,
        `db_fillfin`.`product`.`recommend` AS `recommend`,
        `db_fillfin`.`product`.`pre_order` AS `pre_order`,
        `db_fillfin`.`product`.`status` AS `status`,
        `db_fillfin`.`product`.`sex` AS `sex`,
        `db_fillfin`.`product`.`clip` AS `clip`,
        `db_fillfin`.`product`.`store_id` AS `store_id`,
        `db_fillfin`.`product`.`updatedAt` AS `updatedAt`,
        `db_fillfin`.`product`.`createdAt` AS `createdAt`,
        `db_fillfin`.`store`.`name` AS `store_name`,
        `db_fillfin`.`store`.`profile_img` AS `store_profile`,
        `db_fillfin`.`store`.`concept` AS `store_concept`,
        `db_fillfin`.`store`.`age` AS `age`,
        `db_fillfin`.`store`.`weight` AS `weight`,
        `db_fillfin`.`store`.`height` AS `height`,
        `db_fillfin`.`store`.`bwh` AS `bwh` 
    from (`db_fillfin`.`store` 
        join `db_fillfin`.`product` 
        on(`db_fillfin`.`store`.`id` = `db_fillfin`.`product`.`store_id` 
            and `db_fillfin`.`product`.`status` = 'active')
        )
    ) `product_standard` 
    join `db_fillfin`.`product_image` 
    on(`db_fillfin`.`product_image`.`product_id` = `product_standard`.`id`)
) 
group by `product_standard`.`id`)