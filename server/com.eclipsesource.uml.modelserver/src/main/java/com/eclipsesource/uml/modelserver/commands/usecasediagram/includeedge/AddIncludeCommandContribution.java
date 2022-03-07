package com.eclipsesource.uml.modelserver.commands.usecasediagram.includeedge;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddIncludeCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addIncludeContribution";
    public static final String SOURCE_USECASE_URI_FRAGMENT = "sourceUseCaseUriFragment";
    public static final String TARGET_USECASE_URI_FRAGMENT = "targetUseCaseUriFragment";

    public static CCompoundCommand create(final String sourceUseCaseUriFragment, final String targetUseCaseUriFragment) {
        CCompoundCommand addIncludeCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addIncludeCommand.setType(TYPE);
        addIncludeCommand.getProperties().put(SOURCE_USECASE_URI_FRAGMENT, sourceUseCaseUriFragment);
        addIncludeCommand.getProperties().put(TARGET_USECASE_URI_FRAGMENT, targetUseCaseUriFragment);
        return addIncludeCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {
        String sourceUseCaseUriFragment = command.getProperties().get(SOURCE_USECASE_URI_FRAGMENT);
        String targetUseCaseUriFragment = command.getProperties().get(TARGET_USECASE_URI_FRAGMENT);

        return new AddIncludeCompoundCommand(domain, modelUri, sourceUseCaseUriFragment, targetUseCaseUriFragment);
    }
}
