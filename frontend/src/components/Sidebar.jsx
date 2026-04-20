import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
  useColorModeValue,
  useColorMode,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiLogOut, FiPlus, FiUsers, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../utils";

const Sidebar = ({
  setSelectedGroup,
  socket,
  groups,
  userGroups,
  fetchGroups,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const sidebarBg = useColorModeValue("white", "gray.900");
  const sidebarBorder = useColorModeValue("gray.200", "gray.700");
  const headerTextColor = useColorModeValue("gray.800", "white");
  const plusIconColor = useColorModeValue("blue.600", "blue.200");
  const footerBg = useColorModeValue("gray.50", "gray.800");

  const groupBgJoined = useColorModeValue("blue.50", "blue.900");
  const groupBgUnjoined = useColorModeValue("gray.50", "gray.800");
  const groupBorderJoined = useColorModeValue("blue.200", "blue.700");
  const groupBorderUnjoined = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const badgeVariant = useColorModeValue("subtle", "solid");
  const logoutHoverBg = useColorModeValue("red.50", "whiteAlpha.100");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  //Check if login user is an admin
  const checkAdminStatus = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    //!update admin status
    setIsAdmin(userInfo?.isAdmin || false);
  };

  //Create  groups
  const handleCreateGroup = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;
      await axios.post(
        `${apiURL}/api/groups`,
        {
          name: newGroupName,
          description: newGroupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({
        title: "Group Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchGroups();
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (error) {
      toast({
        title: "Error Creating Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };

  //logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  //join group
  const handleJoinGroup = async (groupId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      await axios.post(
        `${apiURL}/api/groups/${groupId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchGroups();
      toast({ title: "Joined group successfully", status: "success" });
    } catch (error) {
      console.log("Join Error:", error);
    }
  };

  //leave group
  const handleLeaveGroup = async (groupId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const token = userInfo.token;

      await axios.post(
        `${apiURL}/api/groups/${groupId}/leave`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSelectedGroup((prev) => (prev?._id === groupId ? null : prev));
      await fetchGroups();

      toast({ title: "Left group successfully", status: "success" });
    } catch (error) {
      toast({
        title: "Error Leaving Group",
        status: "error",
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <Box
      h={{ base: "calc(100vh - 60px)", md: "100%" }}
      borderRight="1px"
      bg={sidebarBg}
      borderColor={sidebarBorder}
      width={{ base: "100%", md: "300px" }}
      display="flex"
      flexDirection="column"
    >
      <Flex
        px={6}
        py={0}
        h="72px"
        align="center"
        borderBottom="1px solid"
        bg={sidebarBg}
        borderColor={sidebarBorder}
        position="sticky"
        top={0}
        zIndex={1}
        backdropFilter="blur(8px)"
        justify="space-between"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="24px" color="blue.500" mr={2} />
          <Text fontSize="xl" fontWeight="bold" color={headerTextColor}>
            Groups
          </Text>
        </Flex>

        <HStack spacing={1}>
          <IconButton
            size="lg"
            fontSize="22px"
            variant="ghost"
            aria-label="Toggle Theme"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            borderRadius="full"
            borderRadius="lg"
          />

          {isAdmin && (
            <Tooltip label="Create New Group" placement="bottom">
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={onOpen}
                borderRadius="full"
              >
                <Icon as={FiPlus} fontSize="20px" color={plusIconColor} />
              </Button>
            </Tooltip>
          )}
        </HStack>
      </Flex>

      <Box flex="1" overflowY="auto" p={4} mb="80px">
        <VStack spacing={3} align="stretch">
          {groups?.map((group) => (
            <Box
              key={group._id}
              p={4}
              cursor="pointer"
              borderRadius="lg"
              bg={
                userGroups?.includes(group?._id)
                  ? groupBgJoined
                  : groupBgUnjoined
              }
              borderColor={
                userGroups?.includes(group?._id)
                  ? groupBorderJoined
                  : groupBorderUnjoined
              }
              borderWidth="1px"
              borderColor={
                userGroups?.includes(group?._id) ? "blue.200" : "gray.200"
              }
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "md",
                borderColor: "blue.300",
              }}
            >
              <Flex justify="space-between" align="center">
                <Box onClick={() => setSelectedGroup(group)} flex="1">
                  <Flex align="center" mb={2}>
                    <Text fontWeight="bold" color={textColor}>
                      {group.name}
                    </Text>

                    {userGroups?.includes(group?._id) && (
                      <Badge ml={2} colorScheme="blue" variant={badgeVariant}>
                        Joined
                      </Badge>
                    )}
                  </Flex>
                </Box>
                <Button
                  size="sm"
                  colorScheme={
                    userGroups?.includes(group?._id) ? "red" : "blue"
                  }
                  variant={userGroups?.includes(group?._id) ? "ghost" : "solid"}
                  ml={3}
                  onClick={(e) => {
                    e.stopPropagation();
                    userGroups?.includes(group?._id)
                      ? handleLeaveGroup(group?._id)
                      : handleJoinGroup(group?._id);
                  }}
                >
                  {userGroups?.includes(group?._id) ? "Leave" : "Join"}
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      <Box
        px={6}
        py={0}
        h="80px"
        display="flex"
        alignItems="center"
        borderTop="1px solid"
        borderColor={sidebarBorder}
        bg={footerBg}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        width={{ base: "100%", md: "300px" }}
        zIndex={2}
      >
        <Button
          variant="ghost"
          onClick={handleLogout}
          colorScheme="red"
          leftIcon={<Icon as={FiLogOut} />}
          _hover={{
            bg: logoutHoverBg,
            transform: "translateY(-2px)",
            shadow: "md",
          }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              width="full"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
