package com.borkdominik.big.glsp.uml.core.handler;

import java.util.List;

import org.eclipse.glsp.server.operations.CreateOperation;

import com.borkdominik.big.glsp.server.features.property_palette.handler.BGUpdateElementPropertyAction;

public class BatchOperation {
    private String tempCreationId;
    private CreateOperation createOperation;
    private List<BGUpdateElementPropertyAction> updateActions;

    public BatchOperation(String tempCreationId, CreateOperation createOperation,
            List<BGUpdateElementPropertyAction> updateActions) {
        this.tempCreationId = tempCreationId;
        this.createOperation = createOperation;
        this.updateActions = updateActions;
    }

    public String getTempCreationId() {
        return tempCreationId;
    }

    public CreateOperation getCreateOperation() {
        return createOperation;
    }

    public List<BGUpdateElementPropertyAction> getUpdateActions() {
        return updateActions;
    }
}
