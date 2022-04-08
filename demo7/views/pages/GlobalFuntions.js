
 $(document).ready(function(){

$('#customerdropdown').change(function()
          {
            $('#select_billing_address').empty().append();
            $('#select_shipping_address').empty().append();
            dropdownData='<option></option>'
         
             var customerInternalid=$('#customerdropdown').find(":selected").val()

             post = {
                 customername:customerInternalid
             }
             
             $.ajax({ 
                            type      : 'POST', //Method type
                            url       : '/getcustomeraddress', //Your form processing file URL
                            data      : JSON.stringify(post), //Forms name
                            contentType: "application/json; charset=utf-8",
                            success   : function(data) 
                                        {
                                            console.log("data",data)
                                            console.log("get inloop",data[0])
                                            if(data.length>0)
                                            {
                                               customerData=data
                                              console.log("get inloop",customerData)
                                                for(var i=0; i<customerData.length; i++)
                                                {
                                                    dropdownData+='<option value="'+customerData[i].values.address+'">'+customerData[i].values.address+'</option>'
                                                    console.log("get inloop",customerData[i].values)
                                                }
                                                 $("#select_billing_address").append(dropdownData); 
                                                 $("#select_shipping_address").append(dropdownData); 

                                                for(var i=0; i<customerData.length; i++)
                                                {
                                                    if(customerData[i].values.isdefaultbilling)
                                                    {
                                                        $('#select_billing_address').val(customerData[i].values.address);
                                                    }
                                                    if(customerData[i].values.isdefaultshipping)
                                                    {
                                                        $('#select_shipping_address').val(customerData[i].values.address);
                                                    }
                                                   
                                                }

                                            }
                                        }
                        });

          });
     });