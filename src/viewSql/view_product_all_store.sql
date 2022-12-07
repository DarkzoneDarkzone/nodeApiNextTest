SELECT store_show.*,
       GROUP_CONCAT(product_image.path_img) as product_img,
       row_number() OVER (ORDER BY `product_image`.`hover` DESC)
FROM
       ( SELECT product.*, 
              store.name as store_name,
              store.profile_img as store_profile, 
              store.concept as store_concept, 
              row_number() OVER (ORDER BY product.createdAt DESC), 
              COUNT(product.id) as totalProduct
       FROM `store` 
       JOIN (product) 
       ON (store.id = product.store_id AND product.status = "active") 
       GROUP BY product.store_id
       ) as store_show 
JOIN product_image 
ON (product_image.product_id = store_show.id AND product_image.member_type = "standard")
GROUP BY store_show.store_id;