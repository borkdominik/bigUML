package com.eclipsesource.uml.modelserver.old.diagram.objectdiagram.object;

public class RemoveObjectCommandContribution { /*-{

    public static final String TYPE = "removeObject";

    public static CCompoundCommand create(final String semanticUri) {
        CCompoundCommand removeObjectCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        removeObjectCommand.setType(TYPE);
        removeObjectCommand.getProperties().put(SEMANTIC_URI_FRAGMENT, semanticUri);
        return removeObjectCommand;
    }

  @Override
  protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
          throws DecodingException {
        String semanticUriFragment = command.getProperties().get(SEMANTIC_URI_FRAGMENT);
        return new RemoveObjectCompoundCommand(domain, modelUri, semanticUriFragment);

  }   */
}
