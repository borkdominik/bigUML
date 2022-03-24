package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.Region;

public class RemoveFinalStateCommand extends UmlSemanticElementCommand {

    protected final String parentSemanticUriFragment;
    protected final String semanticUriFragment;

    public RemoveFinalStateCommand(final EditingDomain domain, final URI modelUri,
                                   final String parentSemanticUriFragment, final String semanticUriFragment) {
        super(domain, modelUri);
        this.parentSemanticUriFragment = parentSemanticUriFragment;
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Region parentRegion = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Region.class);
        FinalState finalStateToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, FinalState.class);
        parentRegion.getSubvertices().remove(finalStateToRemove);
    }
}
