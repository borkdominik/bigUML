package com.borkdominik.big.glsp.uml.core.handler;

import java.util.HashMap;
import java.util.List;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.glsp.server.actions.Action;
import org.eclipse.glsp.server.actions.SetDirtyStateAction;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.features.core.model.ModelSubmissionHandler;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.glsp.server.types.GLSPServerException;

import com.borkdominik.big.glsp.server.core.handler.action.BGActionHandler;
import com.borkdominik.big.glsp.server.core.handler.operation.create.BGCreateEdgeHandlerRegistry;
import com.borkdominik.big.glsp.server.core.handler.operation.create.BGCreateNodeHandlerRegistry;
import com.borkdominik.big.glsp.server.features.property_palette.provider.BGPropertyProviderRegistry;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateEdgeCommand;
import com.borkdominik.big.glsp.uml.uml.commands.UMLCreateNodeCommand;
import com.google.inject.Inject;

/**
 * TODO: This is a temporary solution to handle batch create operations.
 * It should be replaced with a more robust solution that handles batch
 * operations
 * in a more generic way. (NODEJS)
 */
public class UMLBatchCreateOperationHandler extends BGActionHandler<BatchCreateOperation> {

    @Inject
    protected ModelSubmissionHandler modelSubmissionHandler;
    @Inject
    protected BGCreateNodeHandlerRegistry createNodeRegistry;
    @Inject
    protected BGCreateEdgeHandlerRegistry createEdgeRegistry;
    @Inject
    protected BGPropertyProviderRegistry updateRegistry;
    @Inject
    protected EMFIdGenerator idGenerator;

    @Override
    protected List<Action> executeAction(BatchCreateOperation operation) {

        var createNodeCommands = new CompoundCommand("Batch Phase: Create Node Operation");
        var childCommands = new CompoundCommand("Batch Phase: Create Child Node Operation");
        var createEdgeCommands = new CompoundCommand("Batch Phase: Create Edge Operation");
        var updateCommands = new CompoundCommand("Batch Phase: Update Operation");

        var representation = modelState.representation().getUnsafe();
        var createdNodes = new HashMap<String, UMLCreateNodeCommand>();
        var createdEdges = new HashMap<String, UMLCreateEdgeCommand>();

        // Phase: Create nodes
        for (var batchOperation : operation.getOperations()) {
            var createOperation = batchOperation.getCreateOperation();

            if (createOperation == null) {
                continue;
            }

            if (createOperation instanceof CreateNodeOperation createNodeOperation) {
                if (createNodeOperation.getContainerId() != null) {
                    continue;
                }

                var handler = createNodeRegistry.retrieve(representation, createOperation.getElementTypeId());

                var handledCommand = handler.handleCreateNode(createNodeOperation);
                handledCommand.ifPresent(create -> {
                    createNodeCommands.append(create);
                    if (create instanceof CompoundCommand createCompound) {
                        createCompound.getCommandList().forEach(cmd -> {
                            if (cmd instanceof UMLCreateNodeCommand umlCreateNodeCommand) {
                                createdNodes.put(batchOperation.getTempCreationId(), umlCreateNodeCommand);
                            }
                        });
                    }
                });
            }
        }

        this.modelState.execute(createNodeCommands);
        modelSubmissionHandler.submitModel(SetDirtyStateAction.Reason.OPERATION);

        // Phase: Create child nodes
        // This is done by accessing the assignments from the first phase
        for (var batchOperation : operation.getOperations()) {
            var createOperation = batchOperation.getCreateOperation();

            if (createOperation == null) {
                continue;
            }

            if (createOperation instanceof CreateNodeOperation createNodeOperation) {
                if (createNodeOperation.getContainerId() == null) {
                    continue;
                }

                var containerId = createNodeOperation.getContainerId();
                createNodeOperation.setContainerId(getIdFromCreatedNodes(containerId, createdNodes));

                var handler = createNodeRegistry.retrieve(representation, createOperation.getElementTypeId());

                var handledCommand = handler.handleCreateNode(createNodeOperation);
                handledCommand.ifPresent(create -> {
                    childCommands.append(create);
                    if (create instanceof CompoundCommand createCompound) {
                        createCompound.getCommandList().forEach(cmd -> {
                            if (cmd instanceof UMLCreateNodeCommand umlCreateNodeCommand) {
                                createdNodes.put(batchOperation.getTempCreationId(), umlCreateNodeCommand);
                            }
                        });
                    }
                });
            }
        }

        this.modelState.execute(childCommands);
        modelSubmissionHandler.submitModel(SetDirtyStateAction.Reason.OPERATION);

        // Phase: Create Edges
        for (var batchOperation : operation.getOperations()) {
            var createOperation = batchOperation.getCreateOperation();

            if (createOperation == null) {
                continue;
            }

            if (createOperation instanceof CreateEdgeOperation createEdgeOperation) {
                var handler = createEdgeRegistry.retrieve(representation, createOperation.getElementTypeId());
                createEdgeOperation.setSourceElementId(
                        this.getIdFromCreatedNodes(createEdgeOperation.getSourceElementId(), createdNodes));
                createEdgeOperation.setTargetElementId(
                        this.getIdFromCreatedNodes(createEdgeOperation.getTargetElementId(), createdNodes));
                var handledCommand = handler.handleCreateEdge(createEdgeOperation);
                handledCommand.ifPresent(create -> {
                    createEdgeCommands.append(create);
                    if (create instanceof CompoundCommand createCompound) {
                        createCompound.getCommandList().forEach(cmd -> {
                            if (cmd instanceof UMLCreateEdgeCommand umlCreateEdgeCommand) {
                                createdEdges.put(batchOperation.getTempCreationId(), umlCreateEdgeCommand);
                            }
                        });
                    }
                });
            }
        }

        this.modelState.execute(createEdgeCommands);
        modelSubmissionHandler.submitModel(SetDirtyStateAction.Reason.OPERATION);

        // Phase: Update nodes
        for (var batchOperation : operation.getOperations()) {
            var actions = batchOperation.getUpdateActions();

            if (actions == null) {
                continue;
            }

            for (var action : actions) {
                var elementId = action.getElementId();
                EObject element = null;

                if (createdNodes.containsKey(elementId)) {
                    element = createdNodes.get(elementId).getElement();
                } else if (createdEdges.containsKey(elementId)) {
                    element = createdEdges.get(elementId).getElement();
                } else {
                    element = modelState.getElementIndex().getOrThrow(action.getElementId());
                }

                var mapper = updateRegistry.retrieve(representation, element.getClass());
                var handler = mapper.stream()
                        .filter(p -> p.matches(action))
                        .findFirst()
                        .orElseThrow();
                action.setElementId(idGenerator.getOrCreateId(element));
                updateCommands.append(handler.handle(action));
            }
        }

        this.modelState.execute(updateCommands);
        return modelSubmissionHandler.submitModel(SetDirtyStateAction.Reason.OPERATION);
    }

    protected String getIdFromCreatedNodes(String id, HashMap<String, UMLCreateNodeCommand> nodes) {
        if (id.startsWith("temp_")) {
            var createCommand = nodes.get(id);

            if (createCommand == null) {
                throw new GLSPServerException("No create node command found for ID: " + id);
            }

            return idGenerator.getOrCreateId(createCommand.getElement());
        }

        return id;
    }

    protected String getIdFromCreatedEdges(String id, HashMap<String, UMLCreateEdgeCommand> edges) {
        if (id.startsWith("temp_")) {
            var createCommand = edges.get(id);

            if (createCommand == null) {
                throw new GLSPServerException("No create edge command found for ID: " + id);
            }

            return idGenerator.getOrCreateId(createCommand.getElement());
        }

        return id;
    }

}
