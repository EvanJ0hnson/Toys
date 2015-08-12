  <?php
    $catalogue_filePath = '../json/items.json';
    $catalogue = json_decode(file_get_contents($catalogue_filePath));
    $id = $_POST['itemId'];

    foreach($catalogue as $category) {
      foreach($category->{'items'} as $item) {
        if (strcmp($id, $item->{'id'}) === 0)
          break 2;
      }
    }

    echo json_encode(array("id"=>$item->{'id'},
                          "photo"=>$item->{'photo'},
                          "title"=>$item->{'title'},
                          "brand"=>$item->{'brand'},
                          "age"=>$item->{'age'},
                          "description"=>$item->{'description'},
                          "price1"=>$item->{'price1'},
                          "price2"=>$item->{'price2'},
                          "price3"=>$item->{'price3'},
                          "available"=>$item->{'available'},
                          "date"=>$item->{'date'}));

    unset($catalogue_filePath);
    unset($catalogue);
    unset($id);
    unset($category);
    unset($item);
  ?>