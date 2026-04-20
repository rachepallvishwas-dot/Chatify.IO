import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUsers, FiCircle } from "react-icons/fi";

const UsersList = ({ users }) => {
  const headerBg = useColorModeValue("white", "gray.900");
  const headerBorder = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.100", "gray.700");
  const userNameColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const onlineBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const onlineColor = useColorModeValue("green.600", "green.300");
  return (
    <Box
      width="260px"
      bg={useColorModeValue("white", "gray.900")}
      borderLeft="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      height="100vh"
      overflowY="auto"
    >
      {/* Header */}
      <Flex
        px={6}
        py={0}
        h="72px"
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={headerBorder}
        bg={headerBg}
        position="sticky"
        top={0}
        zIndex={1}
        boxShadow="sm"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="20px" color="blue.500" mr={2} />
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={useColorModeValue("gray.800", "white")}
          >
            Members
            <Badge ml={2} colorScheme="blue" borderRadius="full" px={2}>
              {users.length}
            </Badge>
          </Text>
        </Flex>
      </Flex>

      {/* Users List */}
      <Box flex="1" overflowY="auto" p={4}>
        <VStack align="stretch" spacing={3}>
          {users.map((user) => (
            <Box key={user._id}>
              <Tooltip label={`${user.username} is online`} placement="left">
                <Flex
                  p={3}
                  bg={cardBg}
                  borderRadius="lg"
                  shadow="sm"
                  align="center"
                  borderWidth="1px"
                  borderColor={cardBorder}
                >
                  <Avatar
                    size="sm"
                    name={user.username}
                    bg="blue.500"
                    color="white"
                    mr={3}
                  />
                  <Box flex="1">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={userNameColor}
                      noOfLines={1}
                    >
                      {user.username}
                    </Text>
                  </Box>
                  <Flex
                    align="center"
                    bg={onlineBg}
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    <Icon
                      as={FiCircle}
                      color="green.400"
                      fontSize="8px"
                      mr={1}
                    />
                    <Text fontSize="xs" color={onlineColor} fontWeight="medium">
                      online
                    </Text>
                  </Flex>
                </Flex>
              </Tooltip>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default UsersList;
