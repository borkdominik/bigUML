package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecase;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class RemoveUseCaseCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "removeUseCase";

    public static CCompoundCommand create(final String semanticUri) {
        CCompoundCommand removeUseCaseCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeUseCaseCommand.setType(TYPE);
        removeUseCaseCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeUseCaseCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command) throws DecodingException {

        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveUseCaseCompoundCommand(domain, modelUri, semanticUriFragment);
    }

}
