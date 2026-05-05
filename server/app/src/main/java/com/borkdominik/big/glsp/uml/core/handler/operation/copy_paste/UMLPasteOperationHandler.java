package com.borkdominik.big.glsp.uml.core.handler.operation.copy_paste;

import java.util.Optional;

import org.eclipse.emf.common.command.Command;
import org.eclipse.glsp.server.gson.GraphGsonConfigurationFactory;
import org.eclipse.glsp.server.operations.PasteOperation;

import com.borkdominik.big.glsp.server.core.handler.operation.copy_paste.BGEMFPasteOperationHandler;
import com.google.inject.Inject;

public class UMLPasteOperationHandler extends BGEMFPasteOperationHandler {

    @Inject
    public UMLPasteOperationHandler(GraphGsonConfigurationFactory gsonConfigurator) {
        super(gsonConfigurator);
    }

    @Override
    public Optional<Command> createCommand(PasteOperation operation) {
        return Optional.empty();
    }

}
