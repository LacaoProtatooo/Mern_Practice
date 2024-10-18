import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Heading, HStack, IconButton, Image, Text, useColorModeValue, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, ModalFooter } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useProductStore } from '../store/product';

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  // For the update modal
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const [updatedProduct, setUpdatedProduct] = useState(product);

  // For the delete confirmation dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const cancelRef = useRef();
  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();

  const handleDeleteProduct = async (pid) => {
    setIsDeleteOpen(false); // Close the confirmation dialog after action
    const { success, message } = await deleteProduct(pid);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const {success,message} = await updateProduct(pid, updatedProduct);
    onUpdateClose();
    if(!success){
        toast({
            title: "Error",
            description: message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } else {
        toast({
            title: "Success",
            description: "Product updated Successfully",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    }
  }

  return (
    <Box
      shadow={'lg'}
      rounded={'lg'}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image src={product.image} alt={product.name} h={48} w='full' objectFit='cover' />

      <Box p={4}>
        <Heading as={'h3'} size={'md'} mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          {/* Update button to open update modal */}
          <IconButton icon={<EditIcon />} onClick={onUpdateOpen} colorScheme="blue" />
          {/* Delete button to open delete confirmation */}
          <IconButton icon={<DeleteIcon />} onClick={() => setIsDeleteOpen(true)} colorScheme="red" />
        </HStack>
      </Box>

      {/* Update Modal (if you have one) */}
      {/* const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); */}
      <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
            <ModalContent>
                <ModalHeader> Update Product </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                <VStack spacing={4}>
                    <Input
                     placeholder='Product Name'
                     name='name'
                     value={updatedProduct.name}
                     onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                    />

                    <Input
                     placeholder='Price'
                     name='price'
                     type='number'
                     value={updatedProduct.price}
                     onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                    />

                    <Input
                     placeholder='Image URL'
                     name='image'
                     value={updatedProduct.image}
                     onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
                    />
                    
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}> Update </Button>

                <Button variant={'ghost'} onClick={onUpdateClose}> Cancel </Button>
            </ModalFooter>
            </ModalContent>

            
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDeleteProduct(product._id)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductCard;
