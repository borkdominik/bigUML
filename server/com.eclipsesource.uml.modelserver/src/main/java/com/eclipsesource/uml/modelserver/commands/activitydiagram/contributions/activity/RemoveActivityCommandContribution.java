package com.eclipsesource.uml.modelserver.commands.activitydiagram.contributions.activity;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.compound.activity.RemoveActivityCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlSemanticCommandContribution;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveActivityCommandContribution extends UmlSemanticCommandContribution {

    public static final String TYPE = "removeActivity";

    public static CCommand create(final String semanticUri) {
        CCommand removePropertyCommand = CCommandFactory.eINSTANCE.createCommand();
        removePropertyCommand.setType(TYPE);
        removePropertyCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removePropertyCommand;
    }

    @Override
    protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String semanticUri = command.getProperties().get(SEMANTIC_URI_FRAGMENT);

        return new RemoveActivityCompoundCommand(domain, modelUri, semanticUri);
    }

}
